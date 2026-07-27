<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import DocumentSidebar from '@/domains/financial/components/DocumentSidebar/DocumentSidebar.vue'
import SidebarSection from '@/domains/financial/components/DocumentSidebar/DocumentSidebarSectionCollapsable.vue'
import DocumentSidebarSectionItem from '@/domains/financial/components/DocumentSidebar/DocumentSidebarSectionItem.vue'
import InvoiceStatusBadge from '@/domains/financial/components/InvoiceStatusBadge.vue'
import CurrencyPicker from '@/domains/shared/components/CurrencyPicker.vue'
import ExchangeRatePicker from '@/domains/shared/components/ExchangeRatePicker.vue'
import PaymentMethodPicker from '@/domains/shared/components/PaymentMethodPicker.vue'
import PaymentStatusPicker from '@/domains/shared/components/PaymentStatusPicker.vue'
import type { IExpenseCreate } from '@/domains/expense/types/expense.type'
import type { TPaymentStatus } from '@/domains/financial/types/financial.type'
import type { IPaymentMethod } from '@/domains/shared/types/paymentMethod.type'

const { t } = useI18n()

defineProps<{
  values: IExpenseCreate
  resetForm: () => void
  isSubmitting: boolean
}>()

const emit = defineEmits<{
  updatePaymentMethodObject: [method: IPaymentMethod | undefined]
  updatePaymentStatus: [status: TPaymentStatus]
  updatePaymentDueDate: [date: string | undefined]
  updatePaymentReference: [reference: string | undefined]
  updatePaymentTerms: [terms: string | undefined]
  updateCurrency: [currency: string]
  updateExchangeDate: [date: string]
  updateSendEmail: [sendEmail: boolean]
  updateEmailTo: [emailTo: string[]]
}>()
</script>

<template>
  <DocumentSidebar>
    <div class="flex flex-row gap-2 mb-2">
      <InvoiceStatusBadge :status="values.status ?? 'draft'" />
    </div>

    <SidebarSection :title="t('financial.fields.payment')">
      <DocumentSidebarSectionItem :title="t('financial.payment.fields.method')">
        <PaymentMethodPicker
          :id="values.payment.method.id"
          :model-value="(values.payment.method as IPaymentMethod)"
          @update:model-value="emit('updatePaymentMethodObject', $event)"
        />
      </DocumentSidebarSectionItem>

      <DocumentSidebarSectionItem :title="t('financial.payment.fields.status')">
        <PaymentStatusPicker
          :model-value="values.payment.status"
          @update:model-value="emit('updatePaymentStatus', ($event as TPaymentStatus))"
        />
      </DocumentSidebarSectionItem>

      <DocumentSidebarSectionItem :title="t('financial.payment.fields.dueDate')">
        <Input
          type="date"
          :value="values.payment.dueDate"
          @update:model-value="emit('updatePaymentDueDate', $event as string | undefined)"
        />
      </DocumentSidebarSectionItem>

      <DocumentSidebarSectionItem :title="t('financial.payment.fields.reference')">
        <Input
          :value="values.payment.reference ?? ''"
          @update:model-value="emit('updatePaymentReference', $event as string | undefined)"
        />
      </DocumentSidebarSectionItem>

      <DocumentSidebarSectionItem :title="t('financial.payment.fields.terms')">
        <Textarea
          :value="values.payment.terms ?? ''"
          @update:model-value="emit('updatePaymentTerms', $event as string | undefined)"
        />
      </DocumentSidebarSectionItem>
    </SidebarSection>

    <Separator />

    <SidebarSection :title="t('financial.fields.currency')">
      <DocumentSidebarSectionItem :title="t('financial.fields.currency')">
        <CurrencyPicker :id="values.currency" @update:id="emit('updateCurrency', $event ?? values.currency)" />
      </DocumentSidebarSectionItem>

      <DocumentSidebarSectionItem :title="t('financial.fields.exchange.date')">
        <Input
          type="date"
          :value="values.body.exchange.date"
          @update:model-value="emit('updateExchangeDate', ($event ?? values.body.exchange.date) as string)"
        />
      </DocumentSidebarSectionItem>

      <DocumentSidebarSectionItem :title="t('financial.fields.exchange.rate')">
        <ExchangeRatePicker :date="values.body.exchange.date" :currency="values.currency" />
      </DocumentSidebarSectionItem>
    </SidebarSection>

    <Separator />

    <SidebarSection
      v-if="values.payment.bankAccount && (values.payment.bankAccount.iban || values.payment.bankAccount.bankName)"
      :title="t('financial.payment.fields.bankAccount')"
    >
      <DocumentSidebarSectionItem v-if="values.payment.bankAccount.bankName" :title="t('financial.payment.bankAccount.bankName')">
        <div class="font-semibold">
          {{ values.payment.bankAccount.bankName }}
        </div>
      </DocumentSidebarSectionItem>

      <DocumentSidebarSectionItem v-if="values.payment.bankAccount.iban" :title="t('financial.payment.bankAccount.iban')">
        <div class="font-semibold font-mono text-sm">
          {{ values.payment.bankAccount.iban }}
        </div>
      </DocumentSidebarSectionItem>

      <DocumentSidebarSectionItem v-if="values.payment.bankAccount.swift" :title="t('financial.payment.bankAccount.swift')">
        <div class="font-semibold font-mono text-sm">
          {{ values.payment.bankAccount.swift }}
        </div>
      </DocumentSidebarSectionItem>

      <DocumentSidebarSectionItem v-if="values.payment.bankAccount.country" :title="t('financial.payment.bankAccount.country')">
        <div class="font-semibold">
          {{ values.payment.bankAccount.country }}
        </div>
      </DocumentSidebarSectionItem>
    </SidebarSection>

    <Separator />

    <div class="flex flex-col gap-2">
      <Button variant="outline" @click="resetForm">
        {{ t('common.cancel', 'Cancel') }}
      </Button>
      <Button type="submit" variant="primary" :disabled="isSubmitting">
        {{ t('expense.add.submit', 'Save Expense') }}
      </Button>
    </div>
  </DocumentSidebar>
</template>
