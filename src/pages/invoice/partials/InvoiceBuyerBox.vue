<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import ContractorPicker from '@/domains/contractor/components/ContractorPicker.vue'
import type { IContractorLookup } from '@/domains/contractor/types/contractor.type'
import type { IInvoiceCreate } from '@/domains/invoice/types/invoice.type'

const { t } = useI18n()

const buyer = defineModel<IContractorLookup | undefined>('buyer')

defineProps<{
  values: IInvoiceCreate
  onBuyerUpdate: (value: IContractorLookup | undefined) => void
}>()
</script>

<template>
  <div class="flex flex-col items-start justify-center gap-y-2 p-6">
    <div class="flex flex-row items-center justify-between gap-x-2 w-full">
      <div class="text-muted-foreground text-sm">
        Buyer
      </div>
      <ContractorPicker
        v-model="buyer"
        class="w-50 overflow-hidden"
        @update:model-value="onBuyerUpdate"
      >
        <template #trigger>
          {{ t('shared.contractor.select') }}
        </template>
      </ContractorPicker>
    </div>
    <div class="font-bold text-lg">
      {{ values.buyer.name }}
    </div>
    <div class="font-semibold text-sm">
      {{ values.buyer.address }}
    </div>
    <div v-if="values.buyer.taxId" class="font-semibold text-sm">
      Tax ID: {{ values.buyer.taxId }}
    </div>
    <div v-if="values.buyer.email" class="font-semibold text-sm">
      {{ values.buyer.email }}
    </div>
  </div>
</template>