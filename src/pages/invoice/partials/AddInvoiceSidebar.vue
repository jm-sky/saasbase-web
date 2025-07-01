<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '@/components/ui/tags-input'
import CurrencyPicker from '@/domains/shared/components/CurrencyPicker.vue'
import ExchangeRatePicker from '@/domains/shared/components/ExchangeRatePicker.vue'
import type { IInvoiceCreate } from '@/domains/invoice/types/invoice.type'

const { t } = useI18n()

defineProps<{
  values: IInvoiceCreate
  resetForm: () => void
  isSubmitting: boolean
}>()

const emit = defineEmits<{
  updateCurrency: [currency: string]
  updateExchangeDate: [date: string]
  updateSendEmail: [sendEmail: boolean]
  updateEmailTo: [emailTo: string[]]
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

    <div class="font-semibold text-sm">
      Mailing
    </div>
    <div class="flex flex-col gap-2">
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