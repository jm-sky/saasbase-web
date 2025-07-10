<script setup lang="ts">
import { templateRef } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import Badge from '@/components/ui/badge/Badge.vue'
import Separator from '@/components/ui/separator/Separator.vue'
import DocumentSidebar from '@/domains/financial/components/DocumentSidebar/DocumentSidebar.vue'
import DocumentSidebarSection from '@/domains/financial/components/DocumentSidebar/DocumentSidebarSection.vue'
import DocumentSidebarSectionItem from '@/domains/financial/components/DocumentSidebar/DocumentSidebarSectionItem.vue'
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
  <DocumentSidebar>
    <div class="flex flex-row gap-2 mb-2">
      <InvoiceStatusBadge :status="invoice?.status ?? 'draft'" />
    </div>

    <DocumentSidebarSection :title="t('financial.fields.payment')">
      <DocumentSidebarSectionItem>
        <template #title>
          {{ t('financial.payment.fields.method') }}
        </template>
        {{ te(`financial.payment.method.${invoice?.payment?.method?.code ?? ''}`) ? t(`financial.payment.method.${invoice?.payment?.method?.code}`) : invoice?.payment?.method?.name }}
      </DocumentSidebarSectionItem>

      <DocumentSidebarSectionItem>
        <template #title>
          {{ t('financial.payment.fields.status') }}
        </template>
        {{ t(`financial.payment.status.${invoice?.payment?.status}`) }}
      </DocumentSidebarSectionItem>

      <DocumentSidebarSectionItem>
        <template #title>
          {{ t('financial.payment.fields.dueDate') }}
        </template>
        {{ invoice?.payment?.dueDate ? toDateString(invoice?.payment?.dueDate) : 'N/A' }}
      </DocumentSidebarSectionItem>

      <DocumentSidebarSectionItem v-if="invoice?.payment?.reference">
        <template #title>
          {{ t('financial.payment.fields.reference') }}
        </template>
        {{ invoice?.payment?.reference }}
      </DocumentSidebarSectionItem>

      <DocumentSidebarSectionItem v-if="invoice?.payment?.terms">
        <template #title>
          {{ t('financial.payment.fields.terms') }}
        </template>
        {{ invoice?.payment?.terms }}
      </DocumentSidebarSectionItem>
    </DocumentSidebarSection>

    <Separator />

    <DocumentSidebarSection :title="t('financial.fields.currency')">
      <DocumentSidebarSectionItem>
        <template #title>
          {{ t('financial.fields.currency') }}
        </template>
        {{ invoice?.currency ?? 'N/A' }}
      </DocumentSidebarSectionItem>

      <DocumentSidebarSectionItem v-if="invoice?.body?.exchange?.date">
        <template #title>
          {{ t('financial.fields.exchange.date') }}
        </template>
        {{ invoice?.body?.exchange?.date ? toDateString(invoice?.body?.exchange?.date) : 'N/A' }}
      </DocumentSidebarSectionItem>

      <DocumentSidebarSectionItem v-if="invoice?.exchangeRate && invoice?.exchangeRate !== 1">
        <template #title>
          {{ t('financial.fields.exchange.rate') }}
        </template>
        {{ invoice?.exchangeRate }}
      </DocumentSidebarSectionItem>
    </DocumentSidebarSection>

    <Separator />

    <DocumentSidebarSection :title="t('financial.fields.mailing')">
      <DocumentSidebarSectionItem v-if="invoice?.options?.sendEmail !== undefined">
        <template #title>
          {{ t('financial.mailing.sendEmail') }}
        </template>
        <Badge :variant="invoice?.options?.sendEmail ? 'success-outline' : 'outline'">
          {{ invoice?.options?.sendEmail ? t('common.yes') : t('common.no') }}
        </Badge>
      </DocumentSidebarSectionItem>

      <DocumentSidebarSectionItem v-if="invoice?.options?.emailTo && invoice?.options?.emailTo.length > 0">
        <div class="text-sm text-muted-foreground">
          {{ t('financial.mailing.emailTo') }}
        </div>
        <div class="font-semibold text-sm">
          <div v-for="email in invoice?.options?.emailTo" :key="email" class="mb-1">
            {{ email }}
          </div>
        </div>
      </DocumentSidebarSectionItem>
    </DocumentSidebarSection>

    <Separator />

    <DocumentSidebarSection
      v-if="invoice?.payment?.bankAccount && (invoice?.payment?.bankAccount?.iban || invoice?.payment?.bankAccount?.bankName)"
      :title="t('financial.payment.fields.bankAccount')"
    >
      <DocumentSidebarSectionItem v-if="invoice?.payment?.bankAccount?.bankName">
        <template #title>
          {{ t('financial.payment.bankAccount.bankName') }}
        </template>
        {{ invoice?.payment?.bankAccount?.bankName }}
      </DocumentSidebarSectionItem>

      <DocumentSidebarSectionItem v-if="invoice?.payment?.bankAccount?.iban">
        <template #title>
          {{ t('financial.payment.bankAccount.iban') }}
        </template>
        {{ invoice?.payment?.bankAccount?.iban }}
      </DocumentSidebarSectionItem>

      <DocumentSidebarSectionItem v-if="invoice?.payment?.bankAccount?.swift">
        <template #title>
          {{ t('financial.payment.bankAccount.swift') }}
        </template>
        {{ invoice?.payment?.bankAccount?.swift }}
      </DocumentSidebarSectionItem>

      <DocumentSidebarSectionItem v-if="invoice?.payment?.bankAccount?.country">
        <template #title>
          {{ t('financial.payment.bankAccount.country') }}
        </template>
        {{ invoice?.payment?.bankAccount?.country }}
      </DocumentSidebarSectionItem>
    </DocumentSidebarSection>

    <template #after>
      <div class="border p-4 shadow-xl/30 bg-background mt-4">
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
  </DocumentSidebar>
</template>
