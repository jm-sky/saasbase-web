<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import InvoiceStatusBadge from '@/domains/financial/components/InvoiceStatusBadge.vue'
import { toDateString } from '@/lib/toDateString'
import type { IExpense } from '@/domains/expense/types/expense.type'

const { t } = useI18n()

defineProps<{
  expense?: IExpense | null
}>()
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-row gap-2 mb-2">
      <InvoiceStatusBadge :status="expense?.status ?? 'draft'" />
    </div>

    <div class="uppercase text-sm font-bold text-muted-foreground">
      {{ t('financial.fields.payment') }}
    </div>
    <div class="flex flex-col gap-4">
      <div>
        <div class="text-sm text-muted-foreground">
          {{ t('financial.payment.fields.method') }}
        </div>
        <div class="font-semibold">
          {{ t(`financial.payment.method.${expense?.payment?.method}`) }}
        </div>
      </div>

      <div>
        <div class="text-sm text-muted-foreground">
          {{ t('financial.payment.fields.status') }}
        </div>
        <div class="font-semibold">
          {{ t(`financial.payment.status.${expense?.payment?.status}`) }}
        </div>
      </div>

      <div>
        <div class="text-sm text-muted-foreground">
          {{ t('financial.payment.fields.dueDate') }}
        </div>
        <div class="font-semibold">
          {{ expense?.payment?.dueDate ? toDateString(expense?.payment?.dueDate) : 'N/A' }}
        </div>
      </div>
    </div>
  </div>
</template>
