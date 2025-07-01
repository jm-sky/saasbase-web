<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { IExpenseCreate } from '@/domains/expense/types/expense.type'

const { t } = useI18n()

defineProps<{
  values: IExpenseCreate
}>()
</script>

<template>
  <div class="flex flex-col items-start justify-center gap-y-2 p-6">
    <div class="flex flex-row items-center justify-between gap-x-2 w-full">
      <div class="text-muted-foreground text-sm">
        {{ t('financial.fields.buyer') }}
      </div>
    </div>
    <div class="font-bold text-lg">
      {{ values.buyer.name }}
    </div>
    <div class="font-semibold text-sm">
      {{ values.buyer.address }}
    </div>
    <div v-if="values.buyer.taxId" class="font-semibold text-sm">
      {{ t('financial.fields.taxId') }}: {{ values.buyer.taxId }}
    </div>
    <div v-if="values.buyer.email" class="font-semibold text-sm">
      {{ values.buyer.email }}
    </div>
  </div>
</template>
