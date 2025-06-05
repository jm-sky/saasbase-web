<script setup lang="ts">
import { Send, Square } from 'lucide-vue-next'
import { v4 } from 'uuid'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import LoadingIcon from '@/components/Icons/LoadingIcon.vue'
import Badge from '@/components/ui/badge/Badge.vue'
import Button from '@/components/ui/button/Button.vue'
import ChatBubble from '@/components/ui/chat/ChatBubble.vue'
import ChatBubbleAvatar from '@/components/ui/chat/ChatBubbleAvatar.vue'
import ChatBubbleMessage from '@/components/ui/chat/ChatBubbleMessage.vue'
import ChatInput from '@/components/ui/chat/ChatInput.vue'
import ChatMessageList from '@/components/ui/chat/ChatMessageList.vue'
import ExpandableChat from '@/components/ui/chat/ExpandableChat.vue'
import ExpandableChatBody from '@/components/ui/chat/ExpandableChatBody.vue'
import ExpandableChatFooter from '@/components/ui/chat/ExpandableChatFooter.vue'
import ExpandableChatHeader from '@/components/ui/chat/ExpandableChatHeader.vue'
import { useToast } from '@/components/ui/toast'
import { config } from '@/config'
import { useAuthStore } from '@/domains/auth/store/auth.store'
import { ChatMessage } from '@/domains/chat/models/chat.model'
import { aiChatService } from '@/domains/chat/services/aiChatService'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { initials } from '@/lib/initials'
import echo from '@/plugins/echo.js'
import type { IChatMessage } from '../types/chat.type'
import type { IAiChatMessage } from '@/domains/chat/types/aiChat.type'
import type { IUserPreview } from '@/domains/user/types/user.type'

const STREAMING_DONE_TOKEN = '[DONE]'

const { toast } = useToast()
const { t } = useI18n()
const authStore = useAuthStore()

const createNewAiMessage = (): IChatMessage => ({
  tempId: v4(),
  userId: 'ai',
  user: {
    id: 'ai',
    name: 'AI',
    email: '',
    createdAt: new Date().toISOString(),
  },
  content: '',
  createdAt: new Date().toISOString(),
})

const message = ref('')
const messages = ref<IChatMessage[]>([])
const isSendingMessage = ref(false)
const isStreamingAnswer = ref(false)

const currentAiMessage = ref<IChatMessage>(createNewAiMessage())

const messageList = computed(() => messages.value.map(message => ChatMessage.load(message)))

const startNewResponse = () => {
  currentAiMessage.value = createNewAiMessage()
  messages.value.push(currentAiMessage.value)
}

const handleResponseMessage = (chatMessage: IAiChatMessage) => {
  if (chatMessage.content === STREAMING_DONE_TOKEN) {
    isStreamingAnswer.value = false
  } else {
    currentAiMessage.value.content = `${currentAiMessage.value.content}${chatMessage.content}`
  }
}

const joinRoom = () => {
  const channel = echo.private(`chat.ai.${authStore.userData?.id}`)
  channel.listen('.AiChatMessageStreamed', handleResponseMessage)
  channel.error((error: unknown) => {
    console.error('[FloatingAiChatWidget] Error joining room', error)
    toast.error('Could not join room')
  })
}

const currentUser = (): IUserPreview => ({
  id: authStore.userData?.id ?? '',
  name: authStore.user?.fullName ?? '',
  email: authStore.userData?.email ?? '',
  createdAt: authStore.userData?.createdAt ?? new Date().toISOString(),
})

const sendMessage = async () => {
  try {
    isSendingMessage.value = true
    messages.value.push({
      id: v4(),
      tempId: v4(),
      userId: currentUser().id,
      user: currentUser(),
      content: message.value,
      createdAt: new Date().toISOString(),
    })

    startNewResponse()

    if (config.chat.streaming) {
      isStreamingAnswer.value = true
      await aiChatService.sendMessage(message.value)
    } else {
      // Return message with id, tempId, content
      const response = await aiChatService.sendMessage(message.value) // musi zwracać treść AI
      currentAiMessage.value.content = response.content
      currentAiMessage.value.id = response.id
    }

    message.value = ''
  } catch (error) {
    handleErrorWithToast('Error sending message', error)
  } finally {
    isSendingMessage.value = false
  }
}

const stopSendingMessage = async () => {
  try {
    await aiChatService.stopStream()
    isStreamingAnswer.value = false
  } catch (error) {
    handleErrorWithToast('Error stopping message', error)
  }
}

const isLastAiMessage = (msg: IChatMessage) => msg.id === currentAiMessage.value.id

const onOpened = () => {
  joinRoom()
}
</script>

<template>
  <ExpandableChat size="md" position="bottom-right" @opened="onOpened">
    <ExpandableChatHeader class="flex-col text-center justify-center">
      <h1 class="text-xl font-semibold">
        {{ t('chat.ai.title') }} ✨
      </h1>
      <p class="text-sm text-muted-foreground">
        {{ t('chat.ai.description') }}
      </p>
      <Badge v-if="config.chat.streaming" variant="info-outline" class="text-xs absolute top-10 md:top-2 right-2">
        {{ t('chat.live') }}
      </Badge>
    </ExpandableChatHeader>

    <ExpandableChatBody>
      <ChatMessageList>
        <ChatBubble
          v-for="msg in messageList"
          :key="msg.id"
          :variant="msg.getVariant(authStore.user?.id ?? '')"
        >
          <ChatBubbleAvatar :src="msg.user?.avatarUrl" :fallback="initials(msg.user?.name)" :title="msg.user?.name" />
          <ChatBubbleMessage :variant="msg.getVariant(authStore.user?.id ?? '')" :created-at="msg.createdAt">
            {{ msg.content }}
            <div v-if="(isSendingMessage && isLastAiMessage(msg)) || (!msg.content && isLastAiMessage(msg))" class="flex items-center gap-2 opacity-50 text-xs">
              <LoadingIcon class="size-4" />
              {{ t('common.loading') }}
            </div>
          </ChatBubbleMessage>
        </ChatBubble>
      </ChatMessageList>
    </ExpandableChatBody>

    <ExpandableChatFooter>
      <form class="flex relative gap-2" @submit.prevent="sendMessage">
        <ChatInput
          v-model="message"
          :disabled="isSendingMessage"
          class="min-h-12 bg-background shadow-none pr-10"
          @keydown.enter="sendMessage"
        />
        <Button
          v-if="!isStreamingAnswer"
          v-tooltip="t('chat.ai.send.title')"
          type="submit"
          class="absolute top-1/2 right-2 transform size-8 -translate-y-1/2"
          size="icon"
          :disabled="isSendingMessage"
          :loading="isSendingMessage"
        >
          <Send class="size-4" />
        </Button>
        <Button
          v-else
          v-tooltip="t('chat.ai.stop.title')"
          type="button"
          class="absolute top-1/2 right-2 transform size-8 -translate-y-1/2"
          size="icon"
          @click="stopSendingMessage"
        >
          <Square class="size-4" />
        </Button>
      </form>
    </ExpandableChatFooter>
  </ExpandableChat>
</template>
