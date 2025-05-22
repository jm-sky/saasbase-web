<script setup lang="ts">
import type { IUserPreview } from '@/domains/user/types/user.type'

defineProps<{
  users: IUserPreview[]
  roomId: string
  createRoom: (userId: string) => void
}>()

const emit = defineEmits<{
  create: []
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
      @click="[createRoom(user.id), emit('create')]"
    >
      {{ user.name }}
    </li>
  </ul>
</template>
