<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { money } from '@/lib/money'
import type { IExpenseCreate } from '@/domains/expense/types/expense.type'

const { locale, t } = useI18n()

defineProps<{
  values: IExpenseCreate
}>()
</script>

<template>
  <table class="w-full lg:w-1/2 border-collapse mt-4 text-sm">
    <thead>
      <tr>
        <th class="px-2 py-1 text-muted-foreground text-center border-r">
          {{ t('financial.fields.total') }}
        </th>
        <th class="px-2 py-1 text-muted-foreground text-center border-r">
          {{ t('financial.fields.net') }}
        </th>
        <th class="px-2 py-1 text-muted-foreground text-center">
          {{ t('financial.fields.dueDate') }}
        </th>
      </tr>
    </thead>
    <tbody>
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
    </tbody>
  </table>
</template>
