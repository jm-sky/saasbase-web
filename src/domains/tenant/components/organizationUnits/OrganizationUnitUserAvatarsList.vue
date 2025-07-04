<script setup lang="ts">
import { UserPlus } from 'lucide-vue-next'
import Avatar from '@/components/ui/avatar/Avatar.vue'
import AvatarFallback from '@/components/ui/avatar/AvatarFallback.vue'
import AvatarImage from '@/components/ui/avatar/AvatarImage.vue'
import Button from '@/components/ui/button/Button.vue'
import type { IOrganizationUnitUser } from '../../types/organizationUnit.type'

defineProps<{
  users: IOrganizationUnitUser[]
  editable?: boolean
}>()

const emit = defineEmits<{
  assign: []
  'user-click': [IOrganizationUnitUser]
}>()
</script>

<template>
  <div class="flex flex-row px-2 mt-2">
    <div
      v-for="user in users.slice(0, 5)"
      :key="user.id"
      v-tooltip="`${user.name} | ${user.position ?? '-'} | ${user.role}`"
      class="-ml-2 hover:z-10 hover:scale-105 transition-all duration-300"
      @click.stop="emit('user-click', user)"
    >
      <Avatar class="shadow-sm size-8 hover:outline-primary/50 hover:outline-2 transition-all">
        <AvatarImage :src="user.avatarUrl ?? ''" />
        <AvatarFallback>
          {{ user.name.slice(0, 2) }}
        </AvatarFallback>
      </Avatar>
    </div>

    <Button
      v-if="editable"
      variant="outline"
      size="icon"
      class="rounded-full size-8"
      :class="users.length > 0 ? 'ml-1' : ''"
      @click="emit('assign')"
    >
      <UserPlus class="size-4" />
    </Button>
  </div>
</template>
