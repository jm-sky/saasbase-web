<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import CurrencyPicker from '@/domains/shared/components/CurrencyPicker.vue'
import ExchangeRatePicker from '@/domains/shared/components/ExchangeRatePicker.vue'
import type { IExpenseCreate } from '@/domains/expense/types/expense.type'

const { t } = useI18n()

defineProps<{
  values: IExpenseCreate
  resetForm: () => void
  isSubmitting: boolean
}>()

const emit = defineEmits<{
  updateCurrency: [currency: string]
  updateExchangeDate: [date: string]
}>()
</script>

<template>
  <div class="flex flex-col gap-4 w-xs border p-4 shadow-lg/30">
    <div class="font-semibold text-sm">
      Currency
    </div>
    <div class="flex flex-col gap-1">
      <CurrencyPicker :id="values.currency" @update:id="emit('updateCurrency', $event ?? values.currency)" />
      <Input type="date" :value="values.body.exchange.date" @update:model-value="emit('updateExchangeDate', ($event ?? values.body.exchange.date) as string)" />
      <ExchangeRatePicker :date="values.body.exchange.date" :currency="values.currency" />
    </div>

    <Separator />

    <div class="flex flex-col gap-2">
      <Button variant="outline" @click="resetForm">
        {{ t('common.cancel', 'Cancel') }}
      </Button>
      <Button type="submit" variant="primary" :disabled="isSubmitting">
        {{ t('invoice.add.submit', 'Save Invoice') }}
      </Button>
    </div>
  </div>
</template>