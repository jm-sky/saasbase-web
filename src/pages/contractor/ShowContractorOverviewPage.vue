<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import ContractorAddressesList from '@/domains/contractor/components/addresses/ContractorAddressesList.vue'
import ContractorAttachmentsList from '@/domains/contractor/components/attachments/ContractorAttachmentsList.vue'
import ContractorBankAccountsList from '@/domains/contractor/components/bankAccounts/ContractorBankAccountsList.vue'
import ContractorContactsList from '@/domains/contractor/components/contacts/ContractorContactsList.vue'
import type { IContractor } from '@/domains/contractor/types/contractor.type'

const { t } = useI18n()

defineProps<{
  contractor?: IContractor
}>()
</script>

<template>
  <div class="flex flex-col gap-2 border rounded-md p-4 shadow-lg/5">
    <div class="font-bold">
      {{ t('contractor.fields.description') }}
    </div>
    <div class="text-muted-foreground">
      {{ contractor?.description }}
    </div>
  </div>

  <div class="border rounded-md p-2 shadow-lg/5">
    <ContractorAddressesList />
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div class="border rounded-md p-2 shadow-lg/5">
      <ContractorBankAccountsList :contractor />
    </div>

    <div class="border rounded-md p-2 shadow-lg/5">
      <ContractorContactsList />
    </div>
  </div>

  <div class="border rounded-md p-2 shadow-lg/5">
    <ContractorAttachmentsList />
  </div>
</template>
