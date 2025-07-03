<script setup lang="ts">
import { UserPlus } from 'lucide-vue-next'
import Avatar from '@/components/ui/avatar/Avatar.vue'
import AvatarFallback from '@/components/ui/avatar/AvatarFallback.vue'
import AvatarImage from '@/components/ui/avatar/AvatarImage.vue'
import Button from '@/components/ui/button/Button.vue'
import type { IUserPreview } from '../types/user.type'

defineProps<{
  users: IUserPreview[]
  editable?: boolean
}>()
</script>

<template>
  <div class="flex flex-row">
    <RouterLink
      v-for="user in users.slice(0, 5)"
      :key="user.id"
      v-tooltip="user.name"
      :to="`/users/${user.id}`"
      class="-ml-2 hover:z-10 hover:scale-105 transition-all duration-300"
      @click.stop
    >
      <Avatar class="shadow-sm size-10 hover:outline-primary/50 hover:outline-2 transition-all">
        <AvatarImage :src="user.avatarUrl ?? ''" />
        <AvatarFallback>
          {{ user.name.slice(0, 2) }}
        </AvatarFallback>
      </Avatar>
    </RouterLink>

    <Button
      v-if="editable"
      variant="outline"
      size="icon"
      class="ml-1 rounded-full"
    >
      <UserPlus class="size-4" />
    </Button>
  </div>
</template>
