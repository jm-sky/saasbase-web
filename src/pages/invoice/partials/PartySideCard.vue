<script setup lang="ts">
import { MapPin, User } from 'lucide-vue-next'
import Input from '@/components/ui/input/Input.vue'
import type { IInvoiceBuyer, IInvoiceSeller } from '@/domains/invoice/types/invoice.type'

defineProps<{
  title: string
  values: IInvoiceSeller | IInvoiceBuyer
}>()
</script>

<template>
  <div class="flex flex-col gap-y-2 rounded-lg border p-4">
    <div class="font-bold">
      {{ title }}
    </div>
    <div class="grid grid-cols-[4rem_1fr_1fr] gap-2">
      <Input :model-value="values.country" variant="filled" placeholder="PL" />
      <Input :model-value="values.name" variant="filled" placeholder="Name" />
      <Input :model-value="values.taxId" variant="filled" placeholder="Tax ID" />

      <div class="flex items-center justify-center">
        <MapPin class="size-4" />
      </div>
      <Input
        class="col-span-2"
        :model-value="values.address"
        variant="filled"
        placeholder="Address"
      />

      <div class="flex items-center justify-center">
        <User class="size-4" />
      </div>
      <Input :model-value="values.email" variant="filled" placeholder="Email" />
      <Input :model-value="values.phone" variant="filled" placeholder="Phone" />
    </div>
  </div>
</template>