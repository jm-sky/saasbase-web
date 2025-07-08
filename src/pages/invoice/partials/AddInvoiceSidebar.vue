<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import DatePickerInput from '@/components/Inputs/DatePickerInput.vue'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '@/components/ui/tags-input'
import InvoiceStatusBadge from '@/domains/financial/components/InvoiceStatusBadge.vue'
import CurrencyPicker from '@/domains/shared/components/CurrencyPicker.vue'
import ExchangeRatePicker from '@/domains/shared/components/ExchangeRatePicker.vue'
import PaymentMethodPicker from '@/domains/shared/components/PaymentMethodPicker.vue'
import SidebarSection from './SidebarSection.vue'
import type { IInvoiceCreate } from '@/domains/invoice/types/invoice.type'

const { t } = useI18n()

defineProps<{
  values: IInvoiceCreate
  resetForm: () => void
  isSubmitting: boolean
}>()

const emit = defineEmits<{
  updatePaymentMethod: [method: string]
  updateCurrency: [currency: string]
  updateExchangeDate: [date: string]
  updateSendEmail: [sendEmail: boolean]
  updateEmailTo: [emailTo: string[]]
}>()
</script>

<template>
  <div class="flex flex-col gap-4 w-xs border p-4 shadow-lg/30">
    <div class="flex flex-row gap-2 mb-2">
      <InvoiceStatusBadge :status="values.status ?? 'draft'" />
    </div>

    <SidebarSection :title="t('financial.fields.payment', 'Payment')">
      <FormField name="payment.method">
        <FormItem class="space-y-0 flex flex-row items-center justify-between gap-1">
          <FormLabel>
            {{ t('financial.payment.fields.method', 'Method') }}
          </FormLabel>
          <FormControl>
            <PaymentMethodPicker
              :id="values.payment.method"
              :model-value="{ id: values.payment.method, name: values.payment.method, key: values.payment.method }"
              class="w-40"
              @update:id="emit('updatePaymentMethod', $event ?? values.payment.method)"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </SidebarSection>

    <SidebarSection :title="t('financial.fields.currency', 'Currency')">
      <FormField name="currency">
        <FormItem class="space-y-0 flex flex-row items-center justify-between gap-1">
          <FormLabel>
            {{ t('financial.fields.currency', 'Currency') }}
          </FormLabel>
          <FormControl>
            <CurrencyPicker
              :id="values.currency"
              :model-value="{ code: values.currency, name: values.currency, symbol: values.currency }"
              class="w-40"
              @update:id="emit('updateCurrency', $event ?? values.currency)"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField name="body.exchange.date">
        <FormItem class="space-y-0 flex flex-row items-center justify-between gap-1">
          <FormLabel>
            {{ t('financial.fields.exchange.date', 'Exchange Date') }}
          </FormLabel>
          <FormControl>
            <DatePickerInput
              :value="values.body.exchange.date"
              class="w-42"
              @update:model-value="emit('updateExchangeDate', ($event ?? values.body.exchange.date) as string)"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField name="body.exchange.rate">
        <FormItem class="space-y-0 flex flex-row items-center justify-between gap-1">
          <FormLabel>
            {{ t('financial.fields.exchange.rate', 'Exchange Rate') }}
          </FormLabel>
          <FormControl>
            <ExchangeRatePicker
              empty-text="-"
              class="w-40"
              :date="values.body.exchange.date"
              :currency="values.currency"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </SidebarSection>

    <Separator />

    <SidebarSection :title="t('financial.fields.mailing', 'Mailing')">
      <FormField v-slot="{ componentField }" name="options.sendEmail">
        <FormItem class="flex flex-row items-center justify-between gap-1">
          <FormLabel>Send email</FormLabel>
          <FormControl>
            <Switch v-bind="componentField" :checked="values?.options.sendEmail" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <TagsInput :model-value="values.options.emailTo" @update:model-value="emit('updateEmailTo', $event as string[])">
        <TagsInputItem v-for="item in values.options.emailTo" :key="item" :value="item">
          <TagsInputItemText />
          <TagsInputItemDelete />
        </TagsInputItem>

        <TagsInputInput placeholder="Email..." />
      </TagsInput>
    </SidebarSection>

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
