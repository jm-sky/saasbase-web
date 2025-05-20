<script setup lang="ts">
import UIIcon from '@/components/UIIcon.vue'
import { type INotification, type TNotificationType } from '@/domains/account/services/Notifications.service'
import { timeAgo } from '@/lib/timeAgo'

defineProps<{
  notification: INotification
}>()

const getIcon = (type: TNotificationType) => {
  switch (type) {
    case 'security.passwordChanged':
      return 'lucide:lock'
    case 'welcome':
      return 'lucide:bell'
    default:
      return 'lucide:bell'
  }
}
</script>

<template>
  <div class="flex gap-2.5 px-5 py-2.5">
    <div class="size-8">
      <div class="size-8 rounded-full bg-muted flex items-center justify-center">
        <UIIcon :icon="getIcon(notification.data.type)" class="size-4" />
      </div>
      <div class="kt-avatar-indicator -end-2 -bottom-2">
        <div class="kt-avatar-status kt-avatar-status-online size-2.5" />
      </div>
    </div>
    <div class="flex flex-col gap-2">
      <div class="flex flex-col gap-1">
        <div class="text-sm font-medium">
          {{ notification.data.title }}
        </div>
        <span class="flex items-center text-xs font-medium text-muted-foreground">
          {{ timeAgo(notification.createdAt) }}
          <span class="rounded-full size-1 bg-muted-foreground/50 mx-1.5" />
          {{ notification.data.source }}
        </span>
      </div>
      <div class="text-sm">
        {{ notification.data.message }}
      </div>
    </div>
  </div>
</template>
