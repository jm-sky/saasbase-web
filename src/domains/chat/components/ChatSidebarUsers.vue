<script setup lang="ts">
import { Icon } from '@iconify/vue'
import Avatar from '@/components/ui/avatar/Avatar.vue'
import AvatarFallback from '@/components/ui/avatar/AvatarFallback.vue'
import AvatarImage from '@/components/ui/avatar/AvatarImage.vue'
import type { IUserPreview } from '@/domains/user/types/user.type'

defineProps<{
  users: IUserPreview[]
  roomId: string
  loading?: boolean
  createRoom: (userId: string) => void
}>()

const emit = defineEmits<{
  create: []
}>()
</script>

<template>
  <div class="flex flex-row items-center gap-2 font-bold mb-1">
    <Icon v-if="loading" icon="lucide:loader" class="animate-spin" />
    Users
  </div>

  <div v-if="users.length === 0" class="text-gray-500 text-sm py-1">
    No users
  </div>

  <ul class="flex flex-col gap-1">
    <li
      v-for="user in users"
      :key="user.id"
      class="flex flex-row gap-4 items-center px-2 py-1 rounded bg-gray-100 text-sm hover:bg-sky-200 cursor-pointer"
      @click="[createRoom(user.id), emit('create')]"
    >
      <Avatar class="size-6">
        <AvatarImage :src="user.avatarUrl ?? ''" :alt="user.name" />
        <AvatarFallback>{{ user.name.slice(0, 2) ?? 'X' }}</AvatarFallback>
      </Avatar>
      <div>{{ user.name }}</div>
    </li>
  </ul>
</template>
