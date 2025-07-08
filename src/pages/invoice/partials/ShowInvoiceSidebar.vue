<script setup lang="ts">
import { templateRef } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import Separator from '@/components/ui/separator/Separator.vue'
import InvoiceStatusBadge from '@/domains/financial/components/InvoiceStatusBadge.vue'
import { invoiceeAttachmentsService } from '@/domains/invoice/services/invoiceAttachmentsService'
import AttachmentListWrapper from '@/domains/shared/components/attachments/AttachmentListWrapper.vue'
import { toDateString } from '@/lib/toDateString'
import type { IInvoice } from '@/domains/invoice/types/invoice.type'

const { t } = useI18n()

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
          {{ t(`financial.payment.method.${invoice?.payment?.method}`) }}
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
    </div>

    <Separator class="my-8" />

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
