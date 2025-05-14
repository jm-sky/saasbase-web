<script setup lang="ts">
import ContractorAddressesList from '@/domains/contractor/components/ContractorAddressesList.vue'
import ContractorAttachmentsList from '@/domains/contractor/components/ContractorAttachmentsList.vue'
import ContractorBankAccountsList from '@/domains/contractor/components/ContractorBankAccountsList.vue'
import ContractorContactsList from '@/domains/contractor/components/ContractorContactsList.vue'
import type { IContractor } from '@/domains/contractor/models/contractor.model'

defineProps<{
  contractor?: IContractor
}>()
</script>

<template>
  <div class="flex flex-col gap-2 border rounded-md p-4 shadow-xs">
    <div class="font-bold">
      Description
    </div>
    <div class="text-muted-foreground">
      {{ contractor?.description }}
    </div>
  </div>

  <div class="border rounded-md p-2 shadow-xs">
    <ContractorAddressesList />
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div class="border rounded-md p-2 shadow-xs">
      <ContractorBankAccountsList />
    </div>

    <div class="border rounded-md p-2 shadow-xs">
      <ContractorContactsList />
    </div>
  </div>

  <div class="border rounded-md p-2 shadow-xs">
    <ContractorAttachmentsList />
  </div>
</template>
