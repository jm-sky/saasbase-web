<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import ActivityLogList from '@/components/activity-log/ActivityLogList.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import type { TenantActivityLog } from '../types/activity-log'
import { TenantActivityLogService } from '../services/activity-log.service'
import { TenantActivityType } from '../types/activity-log'

const route = useRoute()
const logs = ref<TenantActivityLog[]>([])
const loading = ref(true)

const getIcon = (log: TenantActivityLog) => {
  switch (log.event) {
    case TenantActivityType.AddressCreated:
    case TenantActivityType.AddressDeleted:
    case TenantActivityType.AddressSetDefault:
    case TenantActivityType.AddressUpdated:
      return 'i-heroicons-map-pin'
    case TenantActivityType.AttachmentCreated:
    case TenantActivityType.AttachmentDeleted:
    case TenantActivityType.AttachmentUpdated:
      return 'i-heroicons-paper-clip'
    case TenantActivityType.BankAccountCreated:
    case TenantActivityType.BankAccountDeleted:
    case TenantActivityType.BankAccountSetDefault:
    case TenantActivityType.BankAccountUpdated:
      return 'i-heroicons-banknotes'
    case TenantActivityType.Created:
      return 'i-heroicons-plus-circle'
    case TenantActivityType.Deleted:
      return 'i-heroicons-trash'
    case TenantActivityType.InvitationAccepted:
    case TenantActivityType.InvitationSent:
      return 'i-heroicons-envelope'
    case TenantActivityType.LogoCreated:
    case TenantActivityType.LogoDeleted:
    case TenantActivityType.LogoUpdated:
      return 'i-heroicons-photo'
    case TenantActivityType.Updated:
      return 'i-heroicons-pencil-square'
    default:
      return 'i-heroicons-information-circle'
  }
}

const getColor = (log: TenantActivityLog) => {
  switch (log.event) {
    case TenantActivityType.AddressCreated:
    case TenantActivityType.AddressDeleted:
    case TenantActivityType.AddressSetDefault:
    case TenantActivityType.AddressUpdated:
      return 'bg-purple-500'
    case TenantActivityType.AttachmentCreated:
    case TenantActivityType.AttachmentDeleted:
    case TenantActivityType.AttachmentUpdated:
      return 'bg-cyan-500'
    case TenantActivityType.BankAccountCreated:
    case TenantActivityType.BankAccountDeleted:
    case TenantActivityType.BankAccountSetDefault:
    case TenantActivityType.BankAccountUpdated:
      return 'bg-yellow-500'
    case TenantActivityType.Created:
      return 'bg-green-500'
    case TenantActivityType.Deleted:
      return 'bg-red-500'
    case TenantActivityType.InvitationAccepted:
    case TenantActivityType.InvitationSent:
      return 'bg-pink-500'
    case TenantActivityType.LogoCreated:
    case TenantActivityType.LogoDeleted:
    case TenantActivityType.LogoUpdated:
      return 'bg-orange-500'
    case TenantActivityType.Updated:
      return 'bg-blue-500'
    default:
      return 'bg-gray-500'
  }
}

onMounted(async () => {
  try {
    const tenantId = String(route.params.id)
    logs.value = await TenantActivityLogService.getLogs(tenantId)
  } catch (error) {
    handleErrorWithToast('Failed to load activity logs', error)
    console.warn(error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="container py-6">
    <h1 class="mb-6 text-2xl font-bold">
      Activity Log
    </h1>
    <ActivityLogList
      v-if="!loading"
      :logs="logs"
      :get-icon="getIcon"
      :get-color="getColor"
    />
    <div v-else class="flex items-center justify-center py-12">
      <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  </div>
</template>
