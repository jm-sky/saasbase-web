<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import ActivityLogList from '@/components/activity-log/ActivityLogList.vue'
import LoadingIcon from '@/components/Icons/LoadingIcon.vue'
import TenantSectionTitle from '@/domains/tenant/components/TenantSectionTitle.vue'
import { TenantActivityLogService } from '@/domains/tenant/services/TenantActivityLogService'
import { type TenantActivityLog, TenantActivityType } from '@/domains/tenant/types/activity-log'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import type { ITenant } from '@/domains/tenant/types/tenant.type'

defineProps<{
  tenant?: ITenant
}>()

const route = useRoute()
const logs = ref<TenantActivityLog[]>([])
const loading = ref(true)

const getIcon = (log: TenantActivityLog) => {
  switch (log.event) {
    case TenantActivityType.AddressCreated:
    case TenantActivityType.AddressDeleted:
    case TenantActivityType.AddressSetDefault:
    case TenantActivityType.AddressUpdated:
      return 'heroicons:map-pin'
    case TenantActivityType.AttachmentCreated:
    case TenantActivityType.AttachmentDeleted:
    case TenantActivityType.AttachmentUpdated:
      return 'heroicons:paper-clip'
    case TenantActivityType.BankAccountCreated:
    case TenantActivityType.BankAccountDeleted:
    case TenantActivityType.BankAccountSetDefault:
    case TenantActivityType.BankAccountUpdated:
      return 'heroicons:banknotes'
    case TenantActivityType.Created:
      return 'heroicons:plus'
    case TenantActivityType.Deleted:
      return 'heroicons:trash'
    case TenantActivityType.InvitationAccepted:
    case TenantActivityType.InvitationSent:
      return 'heroicons:envelope'
    case TenantActivityType.LogoCreated:
    case TenantActivityType.LogoDeleted:
    case TenantActivityType.LogoUpdated:
      return 'heroicons:photo'
    case TenantActivityType.Updated:
      return 'heroicons:pencil-square'
    default:
      return 'heroicons:information-circle'
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
  <div class="flex flex-col gap-2 border rounded-md p-4 shadow-lg/5 relative">
    <TenantSectionTitle :title="$t('tenant.logs.title')" />

    <ActivityLogList
      v-if="!loading"
      :logs="logs"
      :get-icon="getIcon"
      :get-color="getColor"
    />

    <LoadingIcon v-else class="absolute text-gray-700 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
  </div>
</template>
