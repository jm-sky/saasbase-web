<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import ActivityLogList from '@/components/activity-log/ActivityLogList.vue'
import { ContractorActivityLogService } from '@/domains/contractor/services/ContractorActivityLogService'
import { type ContractorActivityLog, ContractorActivityType } from '@/domains/contractor/types/activity-log'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import type { IContractor } from '@/domains/contractor/types/contractor.type'

defineProps<{
  contractor?: IContractor | null
}>()

const { t } = useI18n()
const route = useRoute()
const logs = ref<ContractorActivityLog[]>([])
const loading = ref(true)

const getIcon = (log: ContractorActivityLog) => {
  switch (log.event) {
    case ContractorActivityType.AddressCreated:
      return 'heroicons:map-pin'
    case ContractorActivityType.AddressDeleted:
      return 'heroicons:map-pin'
    case ContractorActivityType.AddressSetDefault:
      return 'heroicons:map-pin'
    case ContractorActivityType.AddressUpdated:
      return 'heroicons:map-pin'
    case ContractorActivityType.AttachmentCreated:
      return 'heroicons:paper-clip'
    case ContractorActivityType.AttachmentDeleted:
      return 'heroicons:paper-clip'
    case ContractorActivityType.AttachmentUpdated:
      return 'heroicons:paper-clip'
    case ContractorActivityType.BankAccountCreated:
      return 'heroicons:banknotes'
    case ContractorActivityType.BankAccountDeleted:
      return 'heroicons:banknotes'
    case ContractorActivityType.BankAccountSetDefault:
      return 'heroicons:banknotes'
    case ContractorActivityType.BankAccountUpdated:
      return 'heroicons:banknotes'
    case ContractorActivityType.CommentCreated:
      return 'heroicons:chat-bubble-left-right'
    case ContractorActivityType.CommentDeleted:
      return 'heroicons:chat-bubble-left-right'
    case ContractorActivityType.CommentUpdated:
      return 'heroicons:chat-bubble-left-right'
    case ContractorActivityType.ContactCreated:
      return 'heroicons:user'
    case ContractorActivityType.ContactDeleted:
      return 'heroicons:user'
    case ContractorActivityType.ContactUpdated:
      return 'heroicons:user'
    case ContractorActivityType.Created:
      return 'heroicons:plus-circle'
    case ContractorActivityType.Deleted:
      return 'heroicons:trash'
    case ContractorActivityType.LogoCreated:
      return 'heroicons:photo'
    case ContractorActivityType.LogoDeleted:
      return 'heroicons:photo'
    case ContractorActivityType.LogoUpdated:
      return 'heroicons:photo'
    case ContractorActivityType.Updated:
      return 'heroicons:pencil-square'
    default:
      return 'heroicons:information-circle'
  }
}

const getColor = (log: ContractorActivityLog) => {
  switch (log.event) {
    case ContractorActivityType.AddressCreated:
      return 'bg-purple-500'
    case ContractorActivityType.AddressDeleted:
      return 'bg-purple-500'
    case ContractorActivityType.AddressSetDefault:
      return 'bg-purple-500'
    case ContractorActivityType.AddressUpdated:
      return 'bg-purple-500'
    case ContractorActivityType.AttachmentCreated:
      return 'bg-cyan-500'
    case ContractorActivityType.AttachmentDeleted:
      return 'bg-cyan-500'
    case ContractorActivityType.AttachmentUpdated:
      return 'bg-cyan-500'
    case ContractorActivityType.BankAccountCreated:
      return 'bg-yellow-500'
    case ContractorActivityType.BankAccountDeleted:
      return 'bg-yellow-500'
    case ContractorActivityType.BankAccountSetDefault:
      return 'bg-yellow-500'
    case ContractorActivityType.BankAccountUpdated:
      return 'bg-yellow-500'
    case ContractorActivityType.CommentCreated:
      return 'bg-indigo-500'
    case ContractorActivityType.CommentDeleted:
      return 'bg-indigo-500'
    case ContractorActivityType.CommentUpdated:
      return 'bg-indigo-500'
    case ContractorActivityType.ContactCreated:
      return 'bg-pink-500'
    case ContractorActivityType.ContactDeleted:
      return 'bg-pink-500'
    case ContractorActivityType.ContactUpdated:
      return 'bg-pink-500'
    case ContractorActivityType.Created:
      return 'bg-green-500'
    case ContractorActivityType.Deleted:
      return 'bg-red-500'
    case ContractorActivityType.LogoCreated:
      return 'bg-orange-500'
    case ContractorActivityType.LogoDeleted:
      return 'bg-orange-500'
    case ContractorActivityType.LogoUpdated:
      return 'bg-orange-500'
    case ContractorActivityType.Updated:
      return 'bg-blue-500'
    default:
      return 'bg-gray-500'
  }
}

onMounted(async () => {
  try {
    const contractorId = String(route.params.id)
    logs.value = await ContractorActivityLogService.getLogs(contractorId)
  } catch (error) {
    handleErrorWithToast('Failed to load activity logs', error)
    console.warn(error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="flex flex-col gap-2 border rounded-md p-4 shadow-lg/5">
    <h2 class="font-bold">
      {{ t('contractor.logs.title') }}
    </h2>

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
