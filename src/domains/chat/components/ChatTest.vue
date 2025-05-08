<script setup lang="ts">
import { formatDate, parseISO } from 'date-fns'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import Badge from '@/components/ui/badge/Badge.vue'
import Button from '@/components/ui/button/Button.vue'
import Separator from '@/components/ui/separator/Separator.vue'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/toast'
import { useAuthStore } from '@/domains/auth/store/auth.store'
import { userService } from '@/domains/user/services/userService'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import echo from '@/plugins/echo.js'
import type { IChatMessage, IChatRoom, IMessageSentEvent } from '../types/chat.type'
import { chatRoomService } from '../services/chatRoomService'
import type { PublicUser } from '@/domains/user/models/publicUser.model'

const authStore = useAuthStore()
const { toast } = useToast()

const isSending = ref(false)
const users = ref<PublicUser[]>([])
const rooms = ref<IChatRoom[]>([])
const messages = ref<Record<string, IChatMessage[]>>({})
const roomId = ref('')
const message = ref('Hello there!')

const currentRoomMessages = computed<IChatMessage[]>(() => messages.value[roomId.value] ?? [])

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

const joinRoom = (room: string) => {
  if (roomId.value) {
    echo.leave(`chat.room.${roomId.value}`)
  }

  roomId.value = room
  messages.value[roomId.value] = messages.value[roomId.value] ?? []

  const channel = echo.private(`chat.room.${room}`)

  channel.listen('.ChatMessageSent', handleMessageSent)

  channel.error(() => toast.error('Could not join room'))
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
      <div class="border rounded-lg p-4 shadow bg-white">
        <div class="font-bold">
          Messages
        </div>

        <div class="flex flex-col gap-2">
          <div
            v-for="msg in currentRoomMessages"
            :key="msg.id"
            class="p-2 rounded-lg bg-gray-100 mb-2 w-3/4"
            :class="{ 'self-end text-right bg-sky-50': msg.userId === authStore.user?.id }"
          >
            <div class="text-xs text-gray-500 border-b pb-2">
              {{ `${msg.user?.firstName ?? ''} ${msg.user?.lastName ?? ''}`.trim() ?? msg.userId }} @ {{ formatDate(parseISO(msg.createdAt), 'dd.MM.yyyy, HH:mm') }}
            </div>
            <div class="text-sm pt-2">
              {{ msg.content }}
            </div>
          </div>
        </div>

        <div v-if="currentRoomMessages.length === 0" class="text-center text-gray-500 text-sm p-3">
          No messages yet
        </div>

        <div class="border-t p-2 flex flex-row gap-2">
          <Textarea v-model="message" :disabled="!roomId || isSending" />
          <Button :disabled="!roomId || isSending" :loading="isSending" @click="sendMessage">
            Send
          </Button>
        </div>
      </div>

      <div class="border rounded-lg p-4 shadow bg-white">
        <div class="font-bold">
          Rooms
        </div>
        <div v-if="rooms.length === 0" class="text-gray-500 text-sm py-1">
          No rooms
        </div>
        <ul class="flex flex-col gap-1">
          <li
            v-for="room in rooms"
            :key="room.id"
            class="p-2 rounded bg-gray-100 text-sm hover:bg-sky-200 cursor-pointer flex items-center gap-1"
            :class="{ 'bg-sky-200': room.id === roomId }"
            :title="room.id"
            @click="joinRoom(room.id)"
          >
            With:
            <Badge v-for="participant in room.participants" :key="participant.id">
              {{ participant.firstName }} {{ participant.lastName }}
            </Badge>
            <i v-if="room.id === roomId" class="fa-solid fa-check ml-1" />
          </li>
        </ul>

        <Separator class="my-4" />

        <div class="font-bold">
          Users
        </div>
        <div v-if="users.length === 0" class="text-gray-500 text-sm py-1">
          No users
        </div>
        <ul class="flex flex-col gap-1">
          <li
            v-for="user in users"
            :key="user.id"
            class="p-2 rounded bg-gray-100 text-sm hover:bg-sky-200 cursor-pointer"
            @click="createRoom(user.id)"
          >
            {{ user.firstName }} {{ user.lastName }}
          </li>
        </ul>

        <div class="mt-4 border-t text-xs pt-2 text-gray-500">
          You are: {{ authStore.user?.fullName ?? '-' }}
        </div>
      </div>
    </div>
  </div>
</template>
