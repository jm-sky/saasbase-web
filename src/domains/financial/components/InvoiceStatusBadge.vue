<script setup lang="ts">
import { CheckCircle2, Circle, Clock, FileEdit, XCircle } from 'lucide-vue-next'
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
    case 'completed':
      return CheckCircle2
    case 'draft':
      return FileEdit
    case 'issued':
      return CheckCircle2
    case 'processing':
      return Clock
    default:
      return Circle
  }
})

const getColor = () => {
  switch (status) {
    case 'cancelled':
      return 'bg-muted/30 border-muted'
    case 'completed':
      return 'text-success bg-success/10 border-success/30'
    case 'draft':
      return 'bg-muted/30 border-muted'
    case 'issued':
      return 'text-success bg-success/10 border-success/30'
    case 'processing':
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
