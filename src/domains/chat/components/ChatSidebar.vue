<script setup lang="ts">
import { X } from 'lucide-vue-next'
import Button from '@/components/ui/button/Button.vue'
import Separator from '@/components/ui/separator/Separator.vue'
import { useAuthStore } from '@/domains/auth/store/auth.store'
import type { IChatRoom } from '../types/chat.type'
import ChatSidebarRooms from './ChatSidebarRooms.vue'
import ChatSidebarUsers from './ChatSidebarUsers.vue'
import type { IUserPreview } from '@/domains/user/types/user.type'

defineProps<{
  rooms: IChatRoom[]
  users: IUserPreview[]
  roomId: string
  joinRoom: (roomId: string) => void
  createRoom: (userId: string) => void
}>()

const isOpen = defineModel<boolean>('open', { required: true })

const authStore = useAuthStore()
</script>

<template>
  <div
    class="absolute top-0 right-0 flex flex-col gap-1 p-3 w-full md:w-lg h-full z-10 bg-white overflow-auto border-l shadow-lg transition-transform duration-300 ease-in-out"
    :class="isOpen ? 'translate-x-0' : 'translate-x-full'"
  >
    <Button
      variant="ghost"
      size="sm"
      class="absolute top-2 right-2"
      @click="isOpen = false"
    >
      <X />
    </Button>

    <ChatSidebarRooms
      :rooms="rooms"
      :room-id="roomId"
      :join-room="joinRoom"
      @join="isOpen = false"
    />

    <Separator class="my-4" />

    <ChatSidebarUsers
      :users="users"
      :room-id="roomId"
      :create-room="createRoom"
      @create="isOpen = false"
    />

    <div class="mb-0 mt-auto border-t text-xs pt-2 text-center text-gray-500">
      You are: {{ authStore.user?.fullName ?? '-' }}
    </div>
  </div>
</template>
