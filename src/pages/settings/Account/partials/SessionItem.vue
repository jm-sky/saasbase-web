<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import Button from '@/components/ui/button/Button.vue'
import { toDateTimeString } from '@/lib/toDateTimeString'
import type { IUserSession, TUserSessionType } from '@/domains/account/types/userSession.type'

const { t } = useI18n()

defineProps<{
  session: IUserSession
}>()

const emit = defineEmits<{
  terminate: [string]
}>()

const getTypeIcon = (sessionType: TUserSessionType) => {
  const icons = {
    jwt: 'heroicons:key',
    cookie: 'heroicons:finger-print',
  }
  return icons[sessionType] || 'heroicons:question-mark-circle'
}
</script>

<template>
  <div class="flex items-start gap-4 p-4 border rounded-lg shadow">
    <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
      <Icon
        :icon="getTypeIcon(session.type)"
        class="size-5 text-primary"
      />
    </div>
    <div class="flex flex-col gap-1 flex-1 min-w-0">
      <div class="flex items-center gap-2">
        <h3 class="font-medium text-ellipsis max-w-full w-full overflow-hidden whitespace-nowrap">
          {{ session.deviceName ??session.userAgent ?? '-' }}
        </h3>
        <span
          v-if="session.isCurrent"
          class="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary"
        >
          {{ t('settings.account.sessions.currentSession') }}
        </span>
      </div>
      <p class="font-semibold text-sm text-muted-foreground">
        {{ session.ipAddress }}
      </p>
      <p class="text-sm text-muted-foreground">
        {{ t('settings.account.sessions.lastActive') }}: {{ toDateTimeString(session.lastActiveAt) }}
      </p>
    </div>
    <Button
      v-if="!session.isCurrent"
      variant="destructive"
      size="sm"
      @click="emit('terminate', session.id)"
    >
      {{ t('settings.account.sessions.terminate') }}
    </Button>
  </div>
</template>
