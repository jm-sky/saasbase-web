<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Button } from '@/components/ui/button'
import Separator from '@/components/ui/separator/Separator.vue'
import { toast } from '@/components/ui/toast'
import { accountService, type Device } from '@/domains/account/services/AccountService'
import SettingsHeader from '../partials/SettingsHeader.vue'

const loading = ref(false)
const devices = ref<Device[]>([])

onMounted(async () => {
  await fetchDevices()
})

// AccountService already reports errors via toast and rethrows, so these
// catches only need to stop the rejection from propagating further.
const fetchDevices = async () => {
  loading.value = true
  try {
    devices.value = await accountService.getDevices()
  } catch {
    // handled in AccountService
  } finally {
    loading.value = false
  }
}

const revokeDevice = async (deviceId: string) => {
  try {
    await accountService.terminateSession(deviceId)
    devices.value = devices.value.filter(device => device.id !== deviceId)
    toast.success('Device access revoked successfully')
  } catch {
    // handled in AccountService
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString()
}
</script>

<template>
  <SettingsHeader
    title="Device Management"
    description="Manage your trusted devices."
    :loading
    work-in-progress
    refresh
    @refresh="fetchDevices"
  />

  <Separator />

  <div class="space-y-4">
    <div
      v-for="device in devices"
      :key="device.id"
      class="flex items-center justify-between p-4 border rounded-lg"
    >
      <div class="flex items-center gap-4">
        <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <span class="text-lg text-primary">💻</span>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h3 class="font-medium">
              {{ device.deviceName ?? 'Unknown device' }}
            </h3>
            <span
              v-if="device.isCurrent"
              class="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary"
            >
              Current Device
            </span>
          </div>
          <p v-if="device.ipAddress" class="text-sm text-muted-foreground">
            {{ device.ipAddress }}
          </p>
          <p class="text-sm text-muted-foreground">
            Last active: {{ formatDate(device.lastActiveAt) }}
          </p>
        </div>
      </div>
      <Button
        v-if="!device.isCurrent"
        variant="destructive"
        size="sm"
        @click="revokeDevice(device.id)"
      >
        Revoke Access
      </Button>
    </div>
  </div>
</template>
