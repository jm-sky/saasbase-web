<script setup lang="ts">
import { templateRef } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import Separator from '@/components/ui/separator/Separator.vue'
import InvoiceStatusBadge from '@/domains/financial/components/InvoiceStatusBadge.vue'
import { invoiceeAttachmentsService } from '@/domains/invoice/services/invoiceAttachmentsService'
import AttachmentListWrapper from '@/domains/shared/components/attachments/AttachmentListWrapper.vue'
import { toDateString } from '@/lib/toDateString'
import type { IInvoice } from '@/domains/invoice/types/invoice.type'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t, te } = useI18n()

defineProps<{
  invoice?: IInvoice | null
}>()

const attachments = templateRef<typeof AttachmentListWrapper>('attachments')

defineExpose({
  attachments,
})
</script>

<template>
  <div class="w-xs flex flex-col gap-4 border p-6 shadow-xl/30 bg-white dark:bg-gray-800">
    <div class="flex flex-row gap-2 mb-2">
      <InvoiceStatusBadge :status="invoice?.status ?? 'draft'" />
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
          {{ te(`financial.payment.method.${invoice?.payment?.method?.code ?? ''}`) ? t(`financial.payment.method.${invoice?.payment?.method?.code}`) : invoice?.payment?.method?.name }}
        </div>
      </div>

      <div>
        <div class="text-sm text-muted-foreground">
          {{ t('financial.payment.fields.status') }}
        </div>
        <div class="font-semibold">
          {{ t(`financial.payment.status.${invoice?.payment?.status}`) }}
        </div>
      </div>

      <div>
        <div class="text-sm text-muted-foreground">
          {{ t('financial.payment.fields.dueDate') }}
        </div>
        <div class="font-semibold">
          {{ invoice?.payment?.dueDate ? toDateString(invoice?.payment?.dueDate) : 'N/A' }}
        </div>
      </div>

      <div v-if="invoice?.payment?.reference">
        <div class="text-sm text-muted-foreground">
          {{ t('financial.payment.fields.reference') }}
        </div>
        <div class="font-semibold">
          {{ invoice?.payment?.reference }}
        </div>
      </div>

      <div v-if="invoice?.payment?.terms">
        <div class="text-sm text-muted-foreground">
          {{ t('financial.payment.fields.terms') }}
        </div>
        <div class="font-semibold text-sm">
          {{ invoice?.payment?.terms }}
        </div>
      </div>
    </div>

    <Separator />

    <div class="uppercase text-sm font-bold text-muted-foreground">
      {{ t('financial.fields.currency') }}
    </div>
    <div class="flex flex-col gap-4">
      <div>
        <div class="text-sm text-muted-foreground">
          {{ t('financial.fields.currency') }}
        </div>
        <div class="font-semibold">
          {{ invoice?.currency ?? 'N/A' }}
        </div>
      </div>

      <div v-if="invoice?.body?.exchange?.date">
        <div class="text-sm text-muted-foreground">
          {{ t('financial.fields.exchange.date') }}
        </div>
        <div class="font-semibold">
          {{ invoice?.body?.exchange?.date ? toDateString(invoice?.body?.exchange?.date) : 'N/A' }}
        </div>
      </div>

      <div v-if="invoice?.exchangeRate && invoice?.exchangeRate !== 1">
        <div class="text-sm text-muted-foreground">
          {{ t('financial.fields.exchange.rate') }}
        </div>
        <div class="font-semibold">
          {{ invoice?.exchangeRate }}
        </div>
      </div>
    </div>

    <Separator />

    <div class="uppercase text-sm font-bold text-muted-foreground">
      {{ t('financial.fields.mailing') }}
    </div>
    <div class="flex flex-col gap-4">
      <div v-if="invoice?.options?.sendEmail !== undefined">
        <div class="text-sm text-muted-foreground">
          Send Email
        </div>
        <div class="font-semibold">
          {{ invoice?.options?.sendEmail ? t('common.yes') : t('common.no') }}
        </div>
      </div>

      <div v-if="invoice?.options?.emailTo && invoice?.options?.emailTo.length > 0">
        <div class="text-sm text-muted-foreground">
          Email Recipients
        </div>
        <div class="font-semibold text-sm">
          <div v-for="email in invoice?.options?.emailTo" :key="email" class="mb-1">
            {{ email }}
          </div>
        </div>
      </div>
    </div>

    <Separator />

    <div v-if="invoice?.payment?.bankAccount && (invoice?.payment?.bankAccount?.iban || invoice?.payment?.bankAccount?.bankName)" class="uppercase text-sm font-bold text-muted-foreground">
      {{ t('financial.fields.bankAccount') }}
    </div>
    <div v-if="invoice?.payment?.bankAccount && (invoice?.payment?.bankAccount?.iban || invoice?.payment?.bankAccount?.bankName)" class="flex flex-col gap-4">
      <div v-if="invoice?.payment?.bankAccount?.bankName">
        <div class="text-sm text-muted-foreground">
          {{ t('financial.payment.bankAccount.bankName') }}
        </div>
        <div class="font-semibold">
          {{ invoice?.payment?.bankAccount?.bankName }}
        </div>
      </div>

      <div v-if="invoice?.payment?.bankAccount?.iban">
        <div class="text-sm text-muted-foreground">
          {{ t('financial.payment.bankAccount.iban') }}
        </div>
        <div class="font-semibold font-mono text-sm">
          {{ invoice?.payment?.bankAccount?.iban }}
        </div>
      </div>

      <div v-if="invoice?.payment?.bankAccount?.swift">
        <div class="text-sm text-muted-foreground">
          {{ t('financial.payment.bankAccount.swift') }}
        </div>
        <div class="font-semibold font-mono text-sm">
          {{ invoice?.payment?.bankAccount?.swift }}
        </div>
      </div>

      <div v-if="invoice?.payment?.bankAccount?.country">
        <div class="text-sm text-muted-foreground">
          {{ t('financial.payment.bankAccount.country') }}
        </div>
        <div class="font-semibold">
          {{ invoice?.payment?.bankAccount?.country }}
        </div>
      </div>
    </div>

    <Separator v-if="invoice?.payment?.bankAccount && (invoice?.payment?.bankAccount?.iban || invoice?.payment?.bankAccount?.bankName)" class="my-8" />

    <AttachmentListWrapper
      ref="attachments"
      :model-id="invoice?.id"
      :service="invoiceeAttachmentsService"
      downloadable
      viewable
      with-icon
    />
  </div>
</template>
