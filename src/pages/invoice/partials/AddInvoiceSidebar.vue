<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import DatePickerInput from '@/components/Inputs/DatePickerInput.vue'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '@/components/ui/tags-input'
import { Textarea } from '@/components/ui/textarea'
import InvoiceStatusBadge from '@/domains/financial/components/InvoiceStatusBadge.vue'
import CurrencyPicker from '@/domains/shared/components/CurrencyPicker.vue'
import ExchangeRatePicker from '@/domains/shared/components/ExchangeRatePicker.vue'
import PaymentMethodPicker from '@/domains/shared/components/PaymentMethodPicker.vue'
import SidebarSection from './SidebarSection.vue'
import type { IInvoiceCreate } from '@/domains/invoice/types/invoice.type'
import type { IPaymentMethod } from '@/domains/shared/types/paymentMethod.type'

const { t } = useI18n()

defineProps<{
  values: IInvoiceCreate
  resetForm: () => void
  isSubmitting: boolean
}>()

const emit = defineEmits<{
  updatePaymentMethod: [method: string]
  updatePaymentStatus: [status: string]
  updatePaymentDueDate: [date: string]
  updatePaymentReference: [reference: string]
  updatePaymentTerms: [terms: string]
  updateCurrency: [currency: string]
  updateExchangeDate: [date: string]
  updateSendEmail: [sendEmail: boolean]
  updateEmailTo: [emailTo: string[]]
  updatePaymentMethodObject: [paymentMethod: IPaymentMethod | undefined]
}>()

const paymentStatuses = [
  { value: 'PENDING', label: t('financial.paymentStatus.pending', 'Pending'), color: 'bg-yellow-500' },
  { value: 'PAID', label: t('financial.paymentStatus.paid', 'Paid'), color: 'bg-green-500' },
  { value: 'OVERDUE', label: t('financial.paymentStatus.overdue', 'Overdue'), color: 'bg-red-500' },
  { value: 'CANCELLED', label: t('financial.paymentStatus.cancelled', 'Cancelled'), color: 'bg-gray-500' },
]

const getCurrentStatusColor = (status: string) => {
  return paymentStatuses.find(s => s.value === status)?.color || 'bg-gray-500'
}

const selectedPaymentMethod = ref<IPaymentMethod | undefined>()

const onPaymentMethodChange = (paymentMethod: IPaymentMethod | undefined) => {
  selectedPaymentMethod.value = paymentMethod
  emit('updatePaymentMethodObject', paymentMethod)
  if (paymentMethod) {
    emit('updatePaymentMethod', paymentMethod.key)
  }
}
</script>

<template>
  <div class="flex flex-col gap-4 w-xs border p-4 shadow-lg/30">
    <div class="flex flex-row gap-2 mb-2">
      <InvoiceStatusBadge :status="values.status ?? 'draft'" />
    </div>

    <SidebarSection :title="t('financial.fields.payment', 'Payment')">
      <FormField name="payment.status">
        <FormItem class="space-y-0 flex flex-row items-center justify-between gap-1">
          <FormLabel required>
            {{ t('financial.payment.status', 'Status') }}
          </FormLabel>
          <FormControl>
            <Select :model-value="values.payment.status" @update:model-value="emit('updatePaymentStatus', $event)">
              <SelectTrigger class="w-40">
                <SelectValue>
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full" :class="getCurrentStatusColor(values.payment.status)" />
                    <span>{{ paymentStatuses.find(s => s.value === values.payment.status)?.label }}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="status in paymentStatuses" :key="status.value" :value="status.value">
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full" :class="status.color" />
                    <span>{{ status.label }}</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField name="payment.method">
        <FormItem class="space-y-0 flex flex-row items-center justify-between gap-1">
          <FormLabel required>
            {{ t('financial.payment.fields.method', 'Method') }}
          </FormLabel>
          <FormControl>
            <PaymentMethodPicker
              :model-value="selectedPaymentMethod"
              class="w-40"
              @update:model-value="onPaymentMethodChange"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField name="payment.dueDate">
        <FormItem class="space-y-0 flex flex-row items-center justify-between gap-1">
          <FormLabel>
            {{ t('financial.payment.dueDate', 'Due Date') }}
          </FormLabel>
          <FormControl>
            <DatePickerInput
              :value="values.payment.dueDate"
              class="w-40"
              @update:model-value="emit('updatePaymentDueDate', $event as string)"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField name="payment.reference">
        <FormItem class="space-y-1">
          <FormLabel>
            {{ t('financial.payment.reference', 'Reference') }}
          </FormLabel>
          <FormControl>
            <Input
              :model-value="values.payment.reference"
              :placeholder="t('financial.payment.referencePlaceholder', 'Payment reference')"
              @update:model-value="emit('updatePaymentReference', $event as string)"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField name="payment.terms">
        <FormItem class="space-y-1">
          <FormLabel>
            {{ t('financial.payment.terms', 'Terms') }}
          </FormLabel>
          <FormControl>
            <Textarea
              :model-value="values.payment.terms"
              :placeholder="t('financial.payment.termsPlaceholder', 'Payment terms')"
              class="min-h-[60px]"
              @update:model-value="emit('updatePaymentTerms', $event as string)"
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
