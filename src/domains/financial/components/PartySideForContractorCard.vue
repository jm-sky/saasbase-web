<script setup lang="ts">
import { MapPin, User } from 'lucide-vue-next'
import { ref } from 'vue'
import Input from '@/components/ui/input/Input.vue'
import ContractorAddressPicker from '@/domains/contractor/components/ContractorAddressPicker.vue'
import ContractorPicker from '@/domains/contractor/components/ContractorPicker.vue'
import type { IInvoiceBuyer, IInvoiceSeller } from '../types/financial.type'
import type { IContractor, IContractorAddress } from '@/domains/contractor/types/contractor.type'

const { type = 'buyer' } = defineProps<{
  title: string
  values: IInvoiceSeller | IInvoiceBuyer
  type?: 'supplier' | 'buyer'
}>()

const contractor = ref<IContractor | undefined>(undefined)
const contractorAddress = ref<IContractorAddress | undefined>(undefined)

const emit = defineEmits<{
  contractorSelected: [IContractor | undefined]
}>()
</script>

<template>
  <div class="flex flex-col gap-y-2 p-4">
    <div class="font-bold">
      {{ title }}
    </div>
    <div class="grid grid-cols-[4rem_1fr_1fr] gap-2">
      <Input :model-value="values.country" variant="filled" placeholder="PL" />

      <ContractorPicker
        :model-value="contractor"
        :type
        @update:model-value="emit('contractorSelected', $event)"
      />

      <Input :model-value="values.taxId" variant="filled" placeholder="Tax ID" />

      <!-- Address -->
      <div class="flex items-center justify-center">
        <MapPin class="size-4" />
      </div>
      <Input
        :model-value="values.address"
        variant="filled"
        placeholder="Address"
      />

      <ContractorAddressPicker :model-value="contractorAddress" :contractor-id="values.contractorId" />

      <!-- Contact -->
      <div class="flex items-center justify-center">
        <User class="size-4" />
      </div>
      <Input :model-value="values.email" variant="filled" placeholder="Email" />
      <Input :model-value="values.phone" variant="filled" placeholder="Phone" />
    </div>
  </div>
</template>