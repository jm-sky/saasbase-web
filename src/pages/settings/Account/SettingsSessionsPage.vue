<script setup lang="ts">
import { onMounted, ref } from 'vue'
import LoadingIcon from '@/components/Icons/LoadingIcon.vue'
import { Button } from '@/components/ui/button'
import Separator from '@/components/ui/separator/Separator.vue'
import { accountService, type UserSession } from '@/domains/account/services/AccountService'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import SettingsHeader from '../partials/SettingsHeader.vue'
import SessionItem from './partials/SessionItem.vue'

const loading = ref(false)
const sessions = ref<UserSession[]>([])

onMounted(async () => {
  await fetchSessions()
})

const fetchSessions = async () => {
  loading.value = true
  try {
    sessions.value = await accountService.getSessions()
  } catch (error: unknown) {
    handleErrorWithToast('Failed to fetch sessions', error)
  } finally {
    loading.value = false
  }
}

const terminateSession = async (sessionId: string) => {
  try {
    await accountService.terminateSession(sessionId)
    sessions.value = sessions.value.filter(session => session.id !== sessionId)
  } catch (error: unknown) {
    handleErrorWithToast('Failed to terminate session', error)
  }
}

const terminateAllSessions = async () => {
  try {
    await accountService.terminateAllSessions()
    sessions.value = sessions.value.filter(session => session.isCurrent)
  } catch (error: unknown) {
    handleErrorWithToast('Failed to terminate all sessions', error)
  }
}
</script>

<template>
  <SettingsHeader
    title="Active Sessions"
    description="Manage your active sessions."
    :loading
    refresh
    work-in-progress
    @refresh="fetchSessions"
  >
    <template #right>
      <Button
        variant="destructive"
        size="sm"
        :disabled="loading || sessions.length <= 1"
        @click="terminateAllSessions"
      >
        Terminate All Other Sessions
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