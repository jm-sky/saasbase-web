<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import Button from '@/components/ui/button/Button.vue'
import Separator from '@/components/ui/separator/Separator.vue'
import { Textarea } from '@/components/ui/textarea'
import { useAuthStore } from '@/domains/auth/store/auth.store'
import { userService } from '@/domains/user/services/userService'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import echo from '@/plugins/echo.js'
import type { IChatMessage, IChatRoom, IMessageSentEvent } from '../types/chat.type'
import { chatRoomService } from '../services/chatRoomService'
import type { PublicUser } from '@/domains/user/models/publicUser.model'

const authStore = useAuthStore()

const isSending = ref(false)
const users = ref<PublicUser[]>([])
const rooms = ref<IChatRoom[]>([])
const messages = ref<IChatMessage[]>([])
const roomId = ref('')
const message = ref('Hello there!')

const getUsers = async () => users.value = await userService.index()
const getRooms = async () => rooms.value = await chatRoomService.index()

function handleMessageSent(event: IMessageSentEvent) {
  messages.value.push(event.data)
}

const createRoom = async (userId: string) => {
  await chatRoomService.create(userId)
  rooms.value = await chatRoomService.index()
}

const joinRoom = (room: string) => {
  roomId.value = room
  echo.private(`chat.room.${room}`).listen('MessageSent', handleMessageSent)
}

const sendMessage = async () => {
  try {
    isSending.value = true
    await chatRoomService.sendMessage(roomId.value, message.value)
    isSending.value = false
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
        <li v-for="msg in messages" :key="msg.id" class="p-2 rounded bg-gray-100">
          <strong>{{ msg.userId }}:</strong> {{ msg.content }}
        </li>
        <div v-if="messages.length === 0" class="text-center text-gray-500 text-sm p-3">
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
        <ul>
          <li
            v-for="room in rooms"
            :key="room.id"
            class="p-2 rounded bg-gray-100 text-sm hover:bg-sky-200 cursor-pointer"
            @click="joinRoom(room.id)"
          >
            {{ room.name }}
          </li>
        </ul>

        <Separator class="my-2" />

        <div class="font-bold">
          Users
        </div>
        <div v-if="users.length === 0" class="text-gray-500 text-sm py-1">
          No users
        </div>
        <ul>
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
