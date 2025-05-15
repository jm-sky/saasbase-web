<script setup lang="ts">
import { Send } from 'lucide-vue-next'
import { v4 } from 'uuid'
import { computed, ref } from 'vue'
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
import { useAuthStore } from '@/domains/auth/store/auth.store'
import { ChatMessage } from '@/domains/chat/models/chat.model'
import { aiChatService } from '@/domains/chat/services/aiChatService'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import echo from '@/plugins/echo.js'
import type { IChatMessage } from '../types/chat.type'
import type { IAiChatMessage } from '@/domains/chat/types/aiChat.type'

const { toast } = useToast()
const authStore = useAuthStore()

const createNewAiMessage = (): IChatMessage => ({
  id: v4(),
  userId: 'ai',
  user: {
    id: 'ai',
    firstName: 'AI',
    lastName: '',
    email: '',
    createdAt: new Date().toISOString(),
  },
  content: '',
  createdAt: new Date().toISOString(),
})

const message = ref('')
const messages = ref<IChatMessage[]>([])
const isSendingMessage = ref(false)

const currentAiMessage = ref<IChatMessage>(createNewAiMessage())

const messageList = computed(() => messages.value.map(message => ChatMessage.load(message)))

const startNewResponse = () => {
  currentAiMessage.value = createNewAiMessage()
  messages.value.push(currentAiMessage.value)
}

const handleMessageSent = (chatMessage: IAiChatMessage) => {
  currentAiMessage.value.content = `${currentAiMessage.value.content}${chatMessage.content}`
}

const joinRoom = () => {
  const channel = echo.private(`chat.ai.${authStore.userData?.id}`)
  channel.listen('.AiChatMessageStreamed', handleMessageSent)
  channel.error((error: unknown) => {
    console.error('[FloatingAiChatWidget] Error joining room', error)
    toast.error('Could not join room')
  })
}

const sendMessage = async () => {
  try {
    isSendingMessage.value = true
    messages.value.push({
      id: v4(),
      userId: authStore.userData?.id ?? '',
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      user: authStore.userData!,
      content: message.value,
      createdAt: new Date().toISOString(),
    })
    startNewResponse()
    await aiChatService.sendMessage(message.value)
    message.value = ''
  } catch (error) {
    handleErrorWithToast('Error sending message', error)
  } finally {
    isSendingMessage.value = false
  }
}

const onOpened = () => {
  joinRoom()
}
</script>

<template>
  <ExpandableChat size="md" position="bottom-right" @opened="onOpened">
    <ExpandableChatHeader class="flex-col text-center justify-center">
      <h1 class="text-xl font-semibold">
        Chat with our AI ✨
      </h1>
      <p>Ask any question for our AI to answer</p>
    </ExpandableChatHeader>

    <ExpandableChatBody>
      <ChatMessageList>
        <ChatBubble
          v-for="msg in messageList"
          :key="msg.id"
          :variant="msg.getVariant(authStore.user?.id ?? '')"
        >
          <ChatBubbleAvatar :src="msg.user?.avatarUrl" :fallback="msg.user?.initials ?? 'AI'" :title="msg.user?.fullName" />
          <ChatBubbleMessage :variant="msg.getVariant(authStore.user?.id ?? '')" :created-at="msg.createdAt">
            {{ msg.content }}
          </ChatBubbleMessage>
        </ChatBubble>
      </ChatMessageList>
    </ExpandableChatBody>

    <ExpandableChatFooter>
      <form class="flex relative gap-2" @submit.prevent="sendMessage">
        <ChatInput
          v-model="message"
          :disabled="isSendingMessage"
          class="min-h-12 bg-background shadow-none"
          @keydown.ctrl.enter="sendMessage"
        />
        <Button
          type="submit"
          class="absolute top-1/2 right-2 transform size-8 -translate-y-1/2"
          size="icon"
          :disabled="isSendingMessage"
          :loading="isSendingMessage"
        >
          <Send class="size-4" />
        </Button>
      </form>
    </ExpandableChatFooter>
  </ExpandableChat>
</template>
