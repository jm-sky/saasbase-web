<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { IInvoiceCreate } from '@/domains/invoice/types/invoice.type'

defineProps<{
  values: IInvoiceCreate
  addLine: () => void
}>()
</script>

<template>
  <div>
    <table class="w-full border-collapse mt-6">
      <thead>
        <tr>
          <th class="p-2 bg-primary" />
          <th class="py-2 px-4 text-white bg-primary text-left w-3/8">
            Items
          </th>
          <th class="py-2 px-4 text-white bg-primary text-right pr-8">
            Quantity
          </th>
          <th class="py-2 px-4 text-white bg-primary text-right pr-8">
            Price
          </th>
          <th class="py-2 px-4 text-white bg-primary text-right pr-8">
            Tax
          </th>
          <th class="py-2 px-4 text-white bg-primary text-right pr-8">
            Total
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in values.body.lines" :key="item.id">
          <td class="border-b p-2 text-end">
            {{ index + 1 }}
          </td>
          <td class="border-b p-2">
            <Input type="text" class="w-full" placeholder="Item" />
          </td>
          <td class="border-b p-2 text-right">
            <Input type="number" class="w-full text-right" placeholder="Quantity" />
          </td>
          <td class="border-b p-2 text-right">
            <Input type="number" class="w-full text-right" placeholder="Price" />
          </td>
          <td class="border-b p-2 text-right">
            <Input type="number" class="w-full text-right" placeholder="Tax" />
          </td>
          <td class="border-b p-2 text-right">
            <Input type="number" class="w-full text-right" placeholder="Total" />
          </td>
        </tr>
      </tbody>
    </table>

    <div class="mt-2 mr-2 flex justify-end">
      <Button type="button" variant="outline" @click="addLine">
        Add Item
      </Button>
    </div>
  </div>
</template>