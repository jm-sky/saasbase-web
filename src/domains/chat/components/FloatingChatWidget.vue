<script setup lang="ts">
import { Send } from 'lucide-vue-next'
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
import { config } from '@/config'
import { useAuthStore } from '@/domains/auth/store/auth.store'
import { ChatMessage } from '@/domains/chat/models/chat.model'
import { chatRoomService } from '@/domains/chat/services/chatRoomService'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import echo from '@/plugins/echo.js'
import type { IChatMessage, IMessageSentEvent } from '@/domains/chat/types/chat.type'

const { toast } = useToast()
const authStore = useAuthStore()

const message = ref('')
const messages = ref<IChatMessage[]>([])
const roomId = ref()
const isSendingMessage = ref(false)

const messageList = computed<ChatMessage[]>(() => (messages.value).map(message => ChatMessage.load(message)))

const createRoom = async () => {
  const response = await chatRoomService.create(config.chat.botId)
  roomId.value = response.id
}

const getMessages = async () => {
  messages.value = await chatRoomService.getMessages(roomId.value)
}

const handleMessageSent = (event: IMessageSentEvent) => {
  messages.value.push(event.data)
}

const joinRoom = async () => {
  const channel = echo.private(`chat.room.${roomId.value}`)
  channel.listen('.ChatMessageSent', handleMessageSent)
  channel.error(() => toast.error('Could not join room'))
  await getMessages()
}

const sendMessage = async () => {
  try {
    isSendingMessage.value = true
    await chatRoomService.sendMessage(roomId.value, message.value)
    message.value = ''
  } catch (error) {
    handleErrorWithToast('Error sending message', error)
  } finally {
    isSendingMessage.value = false
  }
}

const onOpened = async () => {
  await createRoom()
  await joinRoom()
}
</script>

<template>
  <ExpandableChat size="md" position="bottom-right" @opened="onOpened">
    <ExpandableChatHeader class="flex-col text-center justify-center">
      <h1 class="text-xl font-semibold">
        Chat with Your friends
      </h1>
    </ExpandableChatHeader>

    <ExpandableChatBody>
      <ChatMessageList>
        <ChatBubble
          v-for="msg in messageList"
          :key="msg.id"
          :variant="msg.getVariant(authStore.user?.id ?? '')"
        >
          <ChatBubbleAvatar :src="msg.user?.avatarUrl" :fallback="msg.user?.initials" :title="msg.user?.fullName" />
          <ChatBubbleMessage :variant="msg.getVariant(authStore.user?.id ?? '')" :created-at="msg.createdAt">
            {{ msg.content }}
          </ChatBubbleMessage>
        </ChatBubble>
      </ChatMessageList>
    </ExpandableChatBody>

    <ExpandableChatFooter>
      <form class="flex relative gap-2">
        <ChatInput v-model="message" class="min-h-12 bg-background shadow-none" />
        <Button
          type="button"
          class="absolute top-1/2 right-2 transform size-8 -translate-y-1/2"
          size="icon"
          :disabled="isSendingMessage"
          :loading="isSendingMessage"
          @click="sendMessage"
        >
          <Send class="size-4" />
        </Button>
      </form>
    </ExpandableChatFooter>
  </ExpandableChat>
</template>
