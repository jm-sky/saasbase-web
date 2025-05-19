<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { onMounted, ref } from 'vue'
import { Button } from '@/components/ui/button'
import { accountService, type SecurityLog } from '@/domains/account/services/AccountService'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'

const loading = ref(false)
const logs = ref<SecurityLog[]>([])

onMounted(async () => {
  await fetchLogs()
})

const fetchLogs = async () => {
  loading.value = true
  try {
    // TODO: Replace with actual API call
    logs.value = await accountService.getSecurityLog()
  } catch (error: unknown) {
    handleErrorWithToast('Failed to fetch security logs', error)
  } finally {
    loading.value = false
  }
}

const getLogIcon = (type: SecurityLog['type']) => {
  const icons = {
    login: 'heroicons:arrow-right-on-rectangle',
    logout: 'heroicons:arrow-left-on-rectangle',
    password_change: 'heroicons:key',
    '2fa_enabled': 'heroicons:shield-check',
    '2fa_disabled': 'heroicons:shield-exclamation',
    device_added: 'heroicons:device-phone-mobile',
    device_removed: 'heroicons:device-phone-mobile',
  }
  return icons[type]
}

const getLogTitle = (type: SecurityLog['type']) => {
  const titles = {
    login: 'Login',
    logout: 'Logout',
    password_change: 'Password Changed',
    '2fa_enabled': '2FA Enabled',
    '2fa_disabled': '2FA Disabled',
    device_added: 'Device Added',
    device_removed: 'Device Removed',
  }
  return titles[type]
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString()
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-semibold">
        Security Log
      </h2>
      <Button
        variant="outline"
        :disabled="loading"
        @click="fetchLogs"
      >
        Refresh
      </Button>
    </div>

    <div class="card">
      <div class="p-6">
        <div class="space-y-4">
          <div
            v-for="log in logs"
            :key="log.id"
            class="flex items-start gap-4 p-4 border rounded-lg"
          >
            <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Icon
                :icon="getLogIcon(log.type)"
                class="w-5 h-5 text-primary"
              />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <h3 class="font-medium">
                  {{ getLogTitle(log.type) }}
                </h3>
                <span
                  class="px-2 py-0.5 text-xs rounded-full"
                  :class="log.status === 'success' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'"
                >
                  {{ log.status === 'success' ? 'Success' : 'Failed' }}
                </span>
              </div>
              <p class="text-sm text-muted-foreground">
                {{ log.device }} • {{ log.location }}
              </p>
              <p class="text-sm text-muted-foreground">
                IP: {{ log.ip }}
              </p>
              <p class="text-sm text-muted-foreground">
                {{ formatDate(log.timestamp) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>