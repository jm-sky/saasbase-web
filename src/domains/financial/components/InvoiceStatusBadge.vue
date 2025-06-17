<script setup lang="ts">
import { AlertCircle, CheckCircle2, Circle, CircleDot, Clock, FileEdit, Send, XCircle } from 'lucide-vue-next'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { TInvoiceStatus } from '../types/financial.type'

const { t } = useI18n()

const { status } = defineProps<{
  status: TInvoiceStatus
}>()

const iconComponent = computed(() => {
  switch (status) {
    case 'cancelled':
      return XCircle
    case 'draft':
      return FileEdit
    case 'ocrCompleted':
      return CheckCircle2
    case 'ocrFailed':
      return AlertCircle
    case 'ocrProcessing':
      return Clock
    case 'overdue':
      return AlertCircle
    case 'paid':
      return CheckCircle2
    case 'partiallyPaid':
      return CircleDot
    case 'sent':
      return Send
    default:
      return Circle
  }
})

const getColor = () => {
  switch (status) {
    case 'cancelled':
      return 'bg-muted/30 border-muted'
    case 'draft':
      return 'bg-muted/30 border-muted'
    case 'ocrCompleted':
      return 'text-success bg-success/10 border-success/30'
    case 'ocrFailed':
      return 'text-destructive bg-destructive/10 border-destructive/50'
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
    <component :is="iconComponent" class="size-4" />
    <span class="text-sm">
      {{ t(`financial.invoiceStatus.${status}`, status) }}
    </span>
  </div>
</template>