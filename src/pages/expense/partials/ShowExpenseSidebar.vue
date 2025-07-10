<script setup lang="ts">
import { templateRef } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import Badge from '@/components/ui/badge/Badge.vue'
import Separator from '@/components/ui/separator/Separator.vue'
import ExpenseAttachmentsList from '@/domains/expense/components/attachments/ExpenseAttachmentsList.vue'
import DocumentSidebar from '@/domains/financial/components/DocumentSidebar/DocumentSidebar.vue'
import DocumentSidebarSection from '@/domains/financial/components/DocumentSidebar/DocumentSidebarSection.vue'
import DocumentSidebarSectionItem from '@/domains/financial/components/DocumentSidebar/DocumentSidebarSectionItem.vue'
import InvoiceStatusBadge from '@/domains/financial/components/InvoiceStatusBadge.vue'
import AttachmentListWrapper from '@/domains/shared/components/attachments/AttachmentListWrapper.vue'
import { toDateString } from '@/lib/toDateString'
import type { IExpense } from '@/domains/expense/types/expense.type'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t, te } = useI18n()

defineProps<{
  expense?: IExpense | null
}>()

const attachments = templateRef<typeof AttachmentListWrapper>('attachments')

defineExpose({
  attachments,
})
</script>

<template>
  <DocumentSidebar>
    <div class="flex flex-row gap-2 mb-2">
      <InvoiceStatusBadge :status="expense?.status ?? 'draft'" />
    </div>

    <DocumentSidebarSection :title="t('financial.fields.payment')">
      <DocumentSidebarSectionItem :title="t('financial.payment.fields.method')">
        {{ te(`financial.payment.method.${expense?.payment?.method?.code ?? ''}`) ? t(`financial.payment.method.${expense?.payment?.method?.code}`) : expense?.payment?.method?.name }}
      </DocumentSidebarSectionItem>

      <DocumentSidebarSectionItem
        :title="t('financial.payment.fields.status')"
        :value="t(`financial.payment.status.${expense?.payment?.status}`)"
      />

      <DocumentSidebarSectionItem
        :title="t('financial.payment.fields.dueDate')"
        :value="expense?.payment?.dueDate ? toDateString(expense?.payment?.dueDate) : 'N/A'"
      />

      <DocumentSidebarSectionItem
        v-if="expense?.payment?.reference"
        :title="t('financial.payment.fields.reference')"
        :value="expense?.payment?.reference"
      />

      <DocumentSidebarSectionItem
        v-if="expense?.payment?.terms"
        :title="t('financial.payment.fields.terms')"
        :value="expense?.payment?.terms"
      />
    </DocumentSidebarSection>

    <Separator />

    <DocumentSidebarSection :title="t('financial.fields.currency')">
      <DocumentSidebarSectionItem
        :title="t('financial.fields.currency')"
        :value="expense?.currency ?? 'N/A'"
      />

      <DocumentSidebarSectionItem
        v-if="expense?.body?.exchange?.date"
        :title="t('financial.fields.exchange.date')"
        :value="expense?.body?.exchange?.date ? toDateString(expense?.body?.exchange?.date) : 'N/A'"
      />

      <DocumentSidebarSectionItem
        v-if="expense?.exchangeRate && expense?.exchangeRate !== 1"
        :title="t('financial.fields.exchange.rate')"
        :value="expense?.exchangeRate?.toFixed(4) ?? 'N/A'"
      />
    </DocumentSidebarSection>

    <Separator />

    <DocumentSidebarSection :title="t('financial.fields.mailing')">
      <DocumentSidebarSectionItem
        v-if="expense?.options?.sendEmail !== undefined"
        :title="t('financial.mailing.sendEmail')"
      >
        <Badge :variant="expense?.options?.sendEmail ? 'success-outline' : 'outline'">
          {{ expense?.options?.sendEmail ? t('common.yes') : t('common.no') }}
        </Badge>
      </DocumentSidebarSectionItem>

      <DocumentSidebarSectionItem v-if="expense?.options?.emailTo && expense?.options?.emailTo.length > 0">
        <template #title>
          {{ t('financial.mailing.emailTo') }}
        </template>
        <div v-for="email in expense?.options?.emailTo" :key="email" class="mb-1">
          {{ email }}
        </div>
      </DocumentSidebarSectionItem>
    </DocumentSidebarSection>

    <Separator />

    <DocumentSidebarSection
      v-if="expense?.payment?.bankAccount && (expense?.payment?.bankAccount?.iban || expense?.payment?.bankAccount?.bankName)"
      :title="t('financial.fields.bankAccount')"
    >
      <DocumentSidebarSectionItem
        v-if="expense?.payment?.bankAccount?.bankName"
        :title="t('financial.payment.bankAccount.bankName')"
        :value="expense?.payment?.bankAccount?.bankName"
      />

      <DocumentSidebarSectionItem
        v-if="expense?.payment?.bankAccount?.iban"
        :title="t('financial.payment.bankAccount.iban')"
        :value="expense?.payment?.bankAccount?.iban"
      />

      <DocumentSidebarSectionItem
        v-if="expense?.payment?.bankAccount?.swift"
        :title="t('financial.payment.bankAccount.swift')"
        :value="expense?.payment?.bankAccount?.swift"
      />

      <DocumentSidebarSectionItem
        v-if="expense?.payment?.bankAccount?.country"
        :title="t('financial.payment.bankAccount.country')"
        :value="expense?.payment?.bankAccount?.country"
      />
    </DocumentSidebarSection>

    <template #after>
      <div class="border p-4 shadow-xl/30 bg-background mt-4">
        <ExpenseAttachmentsList :expense-id="expense?.id" />
      </div>
    </template>
  </DocumentSidebar>
</template>
