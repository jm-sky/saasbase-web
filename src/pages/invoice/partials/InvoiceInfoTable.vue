<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { money } from '@/lib/money'
import type { IInvoiceCreate } from '@/domains/invoice/types/invoice.type'

const { locale } = useI18n()

defineProps<{
  values: IInvoiceCreate
}>()
</script>

<template>
  <table class="w-1/2 border-collapse mt-4 text-sm">
    <tr>
      <th class="px-2 py-1 text-muted-foreground text-center border-r">
        Total
      </th>
      <th class="px-2 py-1 text-muted-foreground text-center border-r">
        Net
      </th>
      <th class="px-2 py-1 text-muted-foreground text-center">
        Due Date
      </th>
    </tr>
    <tr>
      <td class="font-semibold border-r text-right px-2 py-1">
        {{ money(values.totalGross, values.currency, locale) }}
      </td>
      <td class="font-semibold border-r text-right px-2 py-1">
        {{ money(values.totalNet, values.currency, locale) }}
      </td>
      <td class="font-semibold px-2 py-1">
        {{ values.payment.dueDate }}
      </td>
    </tr>
  </table>
</template>