<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { onMounted, ref } from 'vue'
import { Button } from '@/components/ui/button'
import { accountService, type UserSession } from '@/domains/account/services/AccountService'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'

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
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-semibold">
        Active Sessions
      </h2>
      <div class="flex gap-2">
        <Button
          variant="outline"
          :disabled="loading"
          @click="fetchSessions"
        >
          Refresh
        </Button>
        <Button
          variant="destructive"
          :disabled="loading || sessions.length <= 1"
          @click="terminateAllSessions"
        >
          Terminate All Other Sessions
        </Button>
      </div>
    </div>

    <div class="card">
      <div class="p-6">
        <div class="space-y-4">
          <div
            v-for="session in sessions"
            :key="session.id"
            class="flex items-start gap-4 p-4 border rounded-lg"
          >
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
              @click="terminateSession(session.id)"
            >
              Terminate
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>