<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import LoadingIcon from '@/components/Icons/LoadingIcon.vue'
import { Button } from '@/components/ui/button'
import Separator from '@/components/ui/separator/Separator.vue'
import { userSessionsService } from '@/domains/account/services/UserSessions.service'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import SettingsHeader from '../partials/SettingsHeader.vue'
import SessionItem from './partials/SessionItem.vue'
import type { IUserSession } from '@/domains/account/types/userSession.type'

const { t } = useI18n()

const loading = ref(false)
const sessions = ref<IUserSession[]>([])

onMounted(async () => {
  await fetchSessions()
})

const fetchSessions = async () => {
  loading.value = true
  try {
    sessions.value = (await userSessionsService.index()).data
  } catch (error: unknown) {
    handleErrorWithToast('Failed to fetch sessions', error)
  } finally {
    loading.value = false
  }
}

const terminateSession = async (sessionId: string) => {
  try {
    await userSessionsService.terminateSession(sessionId)
    sessions.value = sessions.value.filter(session => session.id !== sessionId)
  } catch (error: unknown) {
    handleErrorWithToast('Failed to terminate session', error)
  }
}

const terminateAllSessions = async () => {
  try {
    await userSessionsService.terminateAllSessions()
    sessions.value = sessions.value.filter((session) => session.isCurrent)
  } catch (error: unknown) {
    handleErrorWithToast('Failed to terminate all sessions', error)
  }
}
</script>

<template>
  <SettingsHeader
    :title="t('settings.account.sessions.title')"
    :description="t('settings.account.sessions.description')"
    :loading
    refresh
    @refresh="fetchSessions"
  >
    <template #right>
      <Button
        variant="destructive"
        size="sm"
        :disabled="loading || sessions.length <= 1"
        @click="terminateAllSessions"
      >
        {{ t('settings.account.sessions.terminateAll') }}
      </Button>
    </template>
  </SettingsHeader>

  <Separator />

  <div class="space-y-4">
    <div v-if="loading" class="flex justify-center">
      <LoadingIcon class="size-10" />
    </div>

    <SessionItem
      v-for="session in sessions"
      :key="session.id"
      :session
      @terminate="terminateSession"
    />
  </div>
</template>