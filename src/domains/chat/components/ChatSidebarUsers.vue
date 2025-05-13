<script setup lang="ts">
import type { IPublicUser } from '@/domains/user/types/user.type'

defineProps<{
  users: IPublicUser[]
  roomId: string
  joinRoom: (roomId: string) => void
  createRoom: (userId: string) => void
}>()
</script>

<template>
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
      class="px-3 py-2 rounded bg-gray-100 text-sm hover:bg-sky-200 cursor-pointer"
      @click="createRoom(user.id)"
    >
      {{ user.firstName }} {{ user.lastName }}
    </li>
  </ul>
</template>