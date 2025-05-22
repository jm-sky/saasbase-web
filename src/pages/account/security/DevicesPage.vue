<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import { accountService, type Device } from '@/domains/account/services/AccountService'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'

const { toast } = useToast()

const loading = ref(false)
const devices = ref<Device[]>([])

onMounted(async () => {
  await fetchDevices()
})

const fetchDevices = async () => {
  loading.value = true
  try {
    // TODO: Replace with actual API call
    devices.value = await accountService.getDevices()
  } catch (error: unknown) {
    handleErrorWithToast('Failed to fetch devices', error)
  } finally {
    loading.value = false
  }
}

const revokeDevice = async (deviceId: string) => {
  try {
    // TODO: Replace with actual API call
    await accountService.delay(1000)
    devices.value = devices.value.filter(device => device.id !== deviceId)
    toast({
      title: 'Success',
      description: 'Device access revoked successfully',
    })
  } catch (error: unknown) {
    handleErrorWithToast('Failed to revoke device access', error)
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString()
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-semibold">
        Device Management
      </h2>
      <Button
        variant="outline"
        :disabled="loading"
        @click="fetchDevices"
      >
        Refresh
      </Button>
    </div>

    <div class="card">
      <div class="p-6">
        <div class="space-y-4">
          <div
            v-for="device in devices"
            :key="device.id"
            class="flex items-center justify-between p-4 border rounded-lg"
          >
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span class="text-lg text-primary">
                  {{ device.type === 'Mobile' ? '📱' : '💻' }}
                </span>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="font-medium">
                    {{ device.name }}
                  </h3>
                  <span
                    v-if="device.isCurrent"
                    class="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary"
                  >
                    Current Device
                  </span>
                </div>
                <p class="text-sm text-muted-foreground">
                  {{ device.type }} • {{ device.location }}
                </p>
                <p class="text-sm text-muted-foreground">
                  Last active: {{ formatDate(device.lastActive) }}
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
      </div>
    </div>
  </div>
</template>
