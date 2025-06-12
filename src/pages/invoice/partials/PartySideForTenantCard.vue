<script setup lang="ts">
import { Banknote, MapPin, User } from 'lucide-vue-next'
import { ref } from 'vue'
import Input from '@/components/ui/input/Input.vue'
import TenantAddressPicker from '@/domains/tenant/components/TenantAddressPicker.vue'
import TenantBankAccountPicker from '@/domains/tenant/components/TenantBankAccountPicker.vue'
import type { IInvoiceBuyer, IInvoiceSeller } from '@/domains/invoice/types/invoice.type'
import type { ITenantAddress, ITenantBankAccount } from '@/domains/tenant/types/tenant.type'

defineProps<{
  title: string
  values: IInvoiceSeller | IInvoiceBuyer
}>()

const tenantBankAccount = ref<ITenantBankAccount | undefined>(undefined)
const tenantAddress = ref<ITenantAddress | undefined>(undefined)
</script>

<template>
  <div class="flex flex-col gap-y-2 p-4">
    <div class="font-bold">
      {{ title }}
    </div>
    <div class="grid grid-cols-[4rem_1fr_1fr] gap-2">
      <Input :model-value="values.country" variant="filled" placeholder="PL" />
      <Input :model-value="values.name" variant="filled" placeholder="Name" />
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

      <TenantAddressPicker :model-value="tenantAddress" />

      <!-- Contact -->
      <div class="flex items-center justify-center">
        <User class="size-4" />
      </div>

      <Input :model-value="values.email" variant="filled" placeholder="Email" />
      <Input :model-value="values.phone" variant="filled" placeholder="Phone" />

      <!-- Bank account -->
      <div class="flex items-center justify-center">
        <Banknote class="size-4" />
      </div>
      <TenantBankAccountPicker :model-value="tenantBankAccount" />
    </div>
  </div>
</template>