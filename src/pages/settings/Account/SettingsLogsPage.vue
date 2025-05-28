<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ActivityLogList from '@/components/activity-log/ActivityLogList.vue'
import Separator from '@/components/ui/separator/Separator.vue'
import { UserActivityLogService } from '@/domains/user/services/UserActivityLogService'
import { type UserActivityLog, UserActivityType } from '@/domains/user/types/userActivityLog.type'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import SettingsHeader from '../partials/SettingsHeader.vue'
import type { IUser } from '@/domains/user/types/user.type'

defineProps<{
  tenant?: IUser
}>()

const logs = ref<UserActivityLog[]>([])
const loading = ref(true)

const getIcon = (log: UserActivityLog) => {
  switch (log.event) {
    case UserActivityType.AddressCreated:
    case UserActivityType.AddressDeleted:
    case UserActivityType.AddressSetDefault:
    case UserActivityType.AddressUpdated:
      return 'heroicons:map-pin'
    case UserActivityType.AttachmentCreated:
    case UserActivityType.AttachmentDeleted:
    case UserActivityType.AttachmentUpdated:
      return 'heroicons:paper-clip'
    case UserActivityType.BankAccountCreated:
    case UserActivityType.BankAccountDeleted:
    case UserActivityType.BankAccountSetDefault:
    case UserActivityType.BankAccountUpdated:
      return 'heroicons:banknotes'
    case UserActivityType.Created:
      return 'heroicons:plus-circle'
    case UserActivityType.Deleted:
      return 'heroicons:trash'
    case UserActivityType.InvitationAccepted:
    case UserActivityType.InvitationSent:
      return 'heroicons:envelope'
    case UserActivityType.LogoCreated:
    case UserActivityType.LogoDeleted:
    case UserActivityType.LogoUpdated:
      return 'heroicons:photo'
    case UserActivityType.Updated:
      return 'heroicons:pencil-square'
    default:
      return 'heroicons:information-circle'
  }
}

const getColor = (log: UserActivityLog) => {
  switch (log.event) {
    case UserActivityType.AddressCreated:
    case UserActivityType.AddressDeleted:
    case UserActivityType.AddressSetDefault:
    case UserActivityType.AddressUpdated:
      return 'bg-purple-500'
    case UserActivityType.AttachmentCreated:
    case UserActivityType.AttachmentDeleted:
    case UserActivityType.AttachmentUpdated:
      return 'bg-cyan-500'
    case UserActivityType.BankAccountCreated:
    case UserActivityType.BankAccountDeleted:
    case UserActivityType.BankAccountSetDefault:
    case UserActivityType.BankAccountUpdated:
      return 'bg-yellow-500'
    case UserActivityType.Created:
      return 'bg-green-500'
    case UserActivityType.Deleted:
      return 'bg-red-500'
    case UserActivityType.InvitationAccepted:
    case UserActivityType.InvitationSent:
      return 'bg-pink-500'
    case UserActivityType.LogoCreated:
    case UserActivityType.LogoDeleted:
    case UserActivityType.LogoUpdated:
      return 'bg-orange-500'
    case UserActivityType.Updated:
      return 'bg-blue-500'
    default:
      return 'bg-gray-500'
  }
}

const fetchLogs = async () => {
  try {
    logs.value = await UserActivityLogService.getLogs()
  } catch (error) {
    handleErrorWithToast('Failed to load activity logs', error)
    console.warn(error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await fetchLogs()
})
</script>

<template>
  <SettingsHeader
    title="Logs"
    description="View your activity logs."
    :loading
    refresh
    @refresh="fetchLogs"
  />

  <Separator />

  <ActivityLogList
    v-if="!loading"
    :logs="logs"
    :get-icon="getIcon"
    :get-color="getColor"
  />
</template>
