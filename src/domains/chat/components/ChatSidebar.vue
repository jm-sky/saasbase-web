<script setup lang="ts">
import Badge from '@/components/ui/badge/Badge.vue'
import Separator from '@/components/ui/separator/Separator.vue'
import { useAuthStore } from '@/domains/auth/store/auth.store'
import type { IChatRoom } from '../types/chat.type'
import type { IPublicUser } from '@/domains/user/types/user.type'

defineProps<{
  rooms: IChatRoom[]
  users: IPublicUser[]
  roomId: string
  joinRoom: (roomId: string) => void
  createRoom: (userId: string) => void
}>()

const authStore = useAuthStore()
</script>

<template>
  <div class="border rounded-lg p-3 shadow bg-white">
    <div class="font-bold mb-1">
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

    <div class="font-bold mb-1">
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
</template>