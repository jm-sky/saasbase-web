<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import type { TInvoiceStatus } from '../types/financial.type'

const { t } = useI18n()

const { status } =defineProps<{
  status: TInvoiceStatus
}>()

// status = 'draft' | 'ocrProcessing' | 'sent' | 'paid' | 'partiallyPaid' | 'overdue' | 'cancelled'

const getIcon = () => {
  switch (status) {
    case 'cancelled':
      return 'mdi:close-circle'
    case 'draft':
      return 'mdi:circle-edit-outline'
    case 'ocrProcessing':
      return 'mdi:progress-clock'
    case 'overdue':
      return 'mdi:alert-circle'
    case 'paid':
      return 'mdi:check-circle'
    case 'partiallyPaid':
      return 'mdi:checkbox-intermediate'
    case 'sent':
      return 'mdi:send'
  }
  return 'mdi:circle'
}

const getColor = () => {
  switch (status) {
    case 'cancelled':
      return 'bg-muted/30 border-muted'
    case 'draft':
      return 'bg-muted/30 border-muted'
    case 'ocrProcessing':
      return 'text-primary bg-primary/10 border-primary/50'
    case 'overdue':
      return 'text-destructive bg-destructive/10 border-destructive/50'
    case 'paid':
      return 'text-success bg-success/10 border-success/30'
    case 'partiallyPaid':
      return 'text-primary bg-primary/10 border-primary/50'
    case 'sent':
      return 'text-primary bg-primary/10 border-primary/30'
  }
  return 'bg-muted/30 border-muted'
}
</script>

<template>
  <div class="inline-flex items-center gap-2 border rounded-md px-2 py-1" :class="getColor()">
    <Icon :icon="getIcon()" class="size-4" />
    <span class="text-sm">
      {{ t(`financial.invoiceStatus.${status}`, status) }}
    </span>
  </div>
</template>