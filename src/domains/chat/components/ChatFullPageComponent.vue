<script setup lang="ts">
import { Menu } from 'lucide-vue-next'
import { computed, onMounted, onUnmounted, ref, useTemplateRef } from 'vue'
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
import { initials } from '@/lib/initials'
import echo from '@/plugins/echo.js'
import type { IChatMessage, IChatRoom, IMessageSentEvent } from '../types/chat.type'
import { ChatMessage } from '../models/chat.model'
import { chatRoomService } from '../services/chatRoomService'
import ChatSidebar from './ChatSidebar.vue'
import type { IUserPreview } from '@/domains/user/types/user.type'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { toast } = useToast()

const showSidebar = ref(true)
const isSending = ref(false)
const loadingUsers = ref(false)
const loadingRooms = ref(false)
const users = ref<IUserPreview[]>([])
const rooms = ref<IChatRoom[]>([])
const messages = ref<Record<string, IChatMessage[]>>({})
const roomId = ref('')
const message = ref('Hello there!')
const messagesContainer = useTemplateRef<typeof ChatMessageList>('messagesContainer')

const loading = computed<boolean>(() => loadingUsers.value || loadingRooms.value)
const currentRoomMessages = computed<ChatMessage[]>(() => (messages.value[roomId.value] ?? []).map(message => ChatMessage.load(message)))
const selectedRoom = computed<IChatRoom | null>(() => rooms.value.find(room => room.id === roomId.value) ?? null)
const roomParticipants = computed<string>(() => selectedRoom.value?.participants.map(p => p.name).join(', ') ?? '')

const getUsers = async () => {
  try {
    loadingUsers.value = true
    users.value = await userService.index()
  } catch (error) {
    handleErrorWithToast('Could not get users', error)
  } finally {
    loadingUsers.value = false
  }
}
const getRooms = async () => {
  try {
    loadingRooms.value = true
    rooms.value = await chatRoomService.index()
  } catch (error) {
    handleErrorWithToast('Could not get rooms', error)
  } finally {
    loadingRooms.value = false
  }
}

const handleMessageSent = (event: IMessageSentEvent) => {
  messages.value[roomId.value] = messages.value[roomId.value] ?? []
  messages.value[roomId.value].push(event.data)
  messagesContainer.value?.scrollToBottom()
}

const createRoom = async (userId: string) => {
  const room = await chatRoomService.create(userId)
  rooms.value = await chatRoomService.index()
  await joinRoom(room.id)
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
  channel.error((error: unknown) => {
    console.error('[ChatFullPageComponent] Error joining room', error)
    toast.error('Could not join room')
  })

  await getMessages(roomId.value)
}

const sendMessage = async () => {
  try {
    isSending.value = true
    await chatRoomService.sendMessage(roomId.value, message.value)
    messagesContainer.value?.scrollToBottom()
    message.value = 'Ok, so next message now'
  } catch (error) {
    handleErrorWithToast('Could not send message', error)
  } finally {
    isSending.value = false
  }
}

onMounted(async () => {
  if (route.params.roomId) {
    showSidebar.value = false
    await joinRoom(route.params.roomId as string)
  }
  await getUsers()
  await getRooms()
  messagesContainer.value?.scrollToBottom()
})

onUnmounted(() => {
  echo.leave(`chat.room.${roomId.value}`)
})
</script>

<template>
  <div class="p-2 flex flex-col h-full max-w-full overflow-x-hidden">
    <ChatMessageList ref="messagesContainer" class="w-full md:w-5xl mx-auto">
      <ChatBubble
        v-for="msg in currentRoomMessages"
        :key="msg.id"
        :variant="msg.getVariant(authStore.user?.id ?? '')"
      >
        <ChatBubbleAvatar :src="msg.user?.avatarUrl" :fallback="initials(msg.user?.name)" :title="msg.user?.name" />
        <ChatBubbleMessage :variant="msg.getVariant(authStore.user?.id ?? '')" :created-at="msg.createdAt">
          {{ msg.content }}
        </ChatBubbleMessage>
      </ChatBubble>

      <div v-if="currentRoomMessages.length === 0" class="text-center text-gray-500 text-sm p-3">
        No messages yet
      </div>

      <div class="mt-2 p-2 flex flex-row gap-2 w-full">
        <Textarea v-model="message" :disabled="!roomId || isSending" @focus="showSidebar = false" />
        <Button :disabled="!roomId || isSending" :loading="isSending" @click="sendMessage">
          Send
        </Button>
      </div>
    </ChatMessageList>

    <h2 class="w-full md:w-auto px-2 text-lg font-bold absolute py-2 top-2 left-0 md:left-6 bg-white/80 md:bg-transparent backdrop-blur-md">
      Chat
      <template v-if="selectedRoom">
        with
        <span class="text-primary">
          {{ roomParticipants }}
        </span>
      </template>
    </h2>

    <Button
      variant="ghost"
      size="sm"
      class="absolute top-4 right-4"
      @click="showSidebar = !showSidebar"
    >
      <Menu />
    </Button>

    <ChatSidebar
      v-model:open="showSidebar"
      :rooms="rooms"
      :users="users"
      :room-id="roomId"
      :loading
      :join-room="joinRoom"
      :create-room="createRoom"
    />
  </div>
</template>
