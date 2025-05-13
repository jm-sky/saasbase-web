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
import { useAuthStore } from '@/domains/auth/store/auth.store'
import { ChatMessage } from '@/domains/chat/models/chat.model'
import { aiChatService } from '@/domains/chat/services/aiChatService'
import echo from '@/plugins/echo.js'
import type { IChatMessage, IMessageSentEvent } from '@/domains/chat/types/chat.type'

const { toast } = useToast()
const authStore = useAuthStore()

const message = ref('')
const messages = ref<IChatMessage[]>([])

const messageList = computed<ChatMessage[]>(() => (messages.value).map(message => ChatMessage.load(message)))

const handleMessageSent = (event: IMessageSentEvent) => {
  messages.value.push(event.data)
}

const joinRoom = () => {
  const channel = echo.private(`chat.ai.${authStore.userData?.id}`)
  channel.listen('.AiChatMessageStreamed', handleMessageSent)
  channel.error(() => toast.error('Could not join room'))
}

const sendMessage = async () => {
  const response = await aiChatService.sendMessage(message.value)
  messages.value.push(response.data)
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
        >
          <Send class="size-4" @click="sendMessage" />
        </Button>
      </form>
    </ExpandableChatFooter>
  </ExpandableChat>
</template>
