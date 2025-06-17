<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Separator from '@/components/ui/separator/Separator.vue'
import type { IInvoiceLine } from '@/domains/financial/types/financial.type'

const { t } = useI18n()

defineProps<{
  lines: IInvoiceLine[]
  currency: string
  totalNet: number
  totalTax: number
  totalGross: number
}>()
</script>

<template>
  <div class="col-span-2">
    <table class="w-full text-sm">
      <thead>
        <tr>
          <th class="text-sm p-2 text-muted-foreground border-b text-left ">
            {{ t('financial.lines.fields.description') }}
          </th>
          <th class="text-sm p-2 text-muted-foreground border-b text-end">
            {{ t('financial.lines.fields.quantity') }}
          </th>
          <th class="text-sm p-2 text-muted-foreground border-b text-end">
            {{ t('financial.lines.fields.unitPrice') }}
          </th>
          <th class="text-sm p-2 text-muted-foreground border-b text-end">
            {{ t('financial.lines.fields.total') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="lines.length === 0">
          <td colspan="4" class="pt-4 p-2 text-center text-muted-foreground">
            {{ t('common.noItems') }}
          </td>
        </tr>
        <tr v-for="item in lines" :key="item.id">
          <td class="p-2">
            {{ item.description }}
          </td>
          <td class="p-2 text-end">
            {{ item.quantity.toFixed(2) }}
          </td>
          <td class="p-2 text-end">
            {{ item.unitPrice.toFixed(2) }}
          </td>
          <td class="p-2 text-end font-semibold">
            {{ item.totalGross.toFixed(2) }}
            {{ currency }}
          </td>
        </tr>
      </tbody>
    </table>

    <Separator class="my-2" />

    <div class="ml-auto w-1/2 grid grid-cols-2 items-center gap-3 text-sm text-end pe-2">
      <div class="text-muted-foreground text-end">
        {{ t(`expense.fields.totalNet`) }}:
      </div>
      <div class="font-bold">
        {{ totalNet?.toFixed(2) }} {{ currency }}
      </div>
      <div class="text-muted-foreground text-end">
        {{ t(`expense.fields.totalTax`) }}:
      </div>
      <div class="font-bold">
        {{ totalTax?.toFixed(2) }} {{ currency }}
      </div>
      <div class="text-muted-foreground text-end">
        {{ t(`expense.fields.totalGross`) }}:
      </div>
      <div class="font-bold">
        {{ totalGross?.toFixed(2) }} {{ currency }}
      </div>
    </div>
  </div>
</template>