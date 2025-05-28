<script setup lang="ts">
import { Icon } from '@iconify/vue'
import Button from '@/components/ui/button/Button.vue'
import type { UserSession } from '@/domains/account/services/AccountService'

defineProps<{
  session: UserSession
}>()

const emit = defineEmits<{
  terminate: [string]
}>()

const getDeviceIcon = (deviceType: string) => {
  const icons = {
    desktop: 'heroicons:computer-desktop',
    mobile: 'heroicons:device-phone-mobile',
    tablet: 'heroicons:device-tablet',
  }
  return icons[deviceType as keyof typeof icons] || 'heroicons:question-mark-circle'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString()
}
</script>

<template>
  <div class="flex items-start gap-4 p-4 border rounded-lg">
    <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
      <Icon
        :icon="getDeviceIcon(session.deviceType)"
        class="w-5 h-5 text-primary"
      />
    </div>
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2">
        <h3 class="font-medium">
          {{ session.deviceName }}
        </h3>
        <span
          v-if="session.isCurrent"
          class="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary"
        >
          Current Session
        </span>
      </div>
      <p class="text-sm text-muted-foreground">
        {{ session.deviceType }} • {{ session.location }}
      </p>
      <p class="text-sm text-muted-foreground">
        IP: {{ session.ip }}
      </p>
      <p class="text-sm text-muted-foreground">
        Last active: {{ formatDate(session.lastActive) }}
      </p>
    </div>
    <Button
      v-if="!session.isCurrent"
      variant="destructive"
      size="sm"
      @click="emit('terminate', session.id)"
    >
      Terminate
    </Button>
  </div>
</template>