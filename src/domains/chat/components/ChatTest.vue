<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from '@/components/ui/button/Button.vue'
import ChatBubble from '@/components/ui/chat/ChatBubble.vue'
import ChatBubbleAvatar from '@/components/ui/chat/ChatBubbleAvatar.vue'
import ChatBubbleMessage from '@/components/ui/chat/ChatBubbleMessage.vue'
import ChatMessageList from '@/components/ui/chat/ChatMessageList.vue'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/toast'
import { useAuthStore } from '@/domains/auth/store/auth.store'
import { userService } from '@/domains/user/services/userService'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import echo from '@/plugins/echo.js'
import type { IChatMessage, IChatRoom, IMessageSentEvent } from '../types/chat.type'
import { ChatMessage } from '../models/chat.model'
import { chatRoomService } from '../services/chatRoomService'
import ChatSidebar from './ChatSidebar.vue'
import type { PublicUser } from '@/domains/user/models/publicUser.model'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { toast } = useToast()

const isSending = ref(false)
const users = ref<PublicUser[]>([])
const rooms = ref<IChatRoom[]>([])
const messages = ref<Record<string, IChatMessage[]>>({})
const roomId = ref('')
const message = ref('Hello there!')

const currentRoomMessages = computed<ChatMessage[]>(() => (messages.value[roomId.value] ?? []).map(message => ChatMessage.load(message)))

const getUsers = async () => users.value = await userService.index()
const getRooms = async () => rooms.value = await chatRoomService.index()

const handleMessageSent = (event: IMessageSentEvent) => {
  messages.value[roomId.value] = messages.value[roomId.value] ?? []
  messages.value[roomId.value].push(event.data)
}

const createRoom = async (userId: string) => {
  await chatRoomService.create(userId)
  rooms.value = await chatRoomService.index()
}

const getMessages = async (roomId: string) => {
  messages.value[roomId] = await chatRoomService.getMessages(roomId)
}

const joinRoom = async (room: string) => {
  if (roomId.value) {
    echo.leave(`chat.room.${roomId.value}`)
  }

  await router.replace({ params: { roomId: room } })
  roomId.value = room
  messages.value[roomId.value] = messages.value[roomId.value] ?? []

  const channel = echo.private(`chat.room.${room}`)
  channel.listen('.ChatMessageSent', handleMessageSent)
  channel.error(() => toast.error('Could not join room'))

  await getMessages(roomId.value)
}

const sendMessage = async () => {
  try {
    isSending.value = true
    await chatRoomService.sendMessage(roomId.value, message.value)
    message.value = 'Ok, so next message now'
  } catch (error) {
    handleErrorWithToast('Could not send message', error)
  } finally {
    isSending.value = false
  }
}

onMounted(async () => {
  if (route.params.roomId) {
    await joinRoom(route.params.roomId as string)
  }
  await getUsers()
  await getRooms()
})

onUnmounted(() => {
  echo.leave(`chat.room.${roomId.value}`)
})
</script>

<template>
  <div class="">
    <h2 class="text-lg font-bold mb-4">
      Chat
    </h2>

    <div class="grid grid-cols-[3fr_1fr] gap-2">
      <div class="border rounded-lg overflow-hidden shadow bg-white max-h-[600px]">
        <ChatMessageList>
          <ChatBubble
            v-for="msg in currentRoomMessages"
            :key="msg.id"
            :variant="msg.getVariant(authStore.user?.id ?? '')"
          >
            <ChatBubbleAvatar :src="msg.user?.avatarUrl" :fallback="msg.user?.initials" :title="msg.user?.fullName" />
            <ChatBubbleMessage :variant="msg.getVariant(authStore.user?.id ?? '')" :created-at="msg.createdAt">
              {{ msg.content }}
            </ChatBubbleMessage>
          </ChatBubble>

          <!-- <ChatBubble variant="received">
            <ChatBubbleAvatar fallback="AI" />
            <ChatBubbleMessage is-loading />
          </ChatBubble> -->
        </ChatMessageList>

        <div v-if="currentRoomMessages.length === 0" class="text-center text-gray-500 text-sm p-3">
          No messages yet
        </div>
      </div>

      <ChatSidebar
        :rooms="rooms"
        :users="users"
        :room-id="roomId"
        :join-room="joinRoom"
        :create-room="createRoom"
      />

      <div class="col-span-full mt-2 p-2 flex flex-row gap-2">
        <Textarea v-model="message" :disabled="!roomId || isSending" />
        <Button :disabled="!roomId || isSending" :loading="isSending" @click="sendMessage">
          Send
        </Button>
      </div>
    </div>
  </div>
</template>
