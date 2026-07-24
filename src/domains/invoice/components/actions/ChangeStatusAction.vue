<script setup lang="ts">
import { RefreshCw } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/components/ui/toast'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { invoiceService } from '../../services/invoiceService'
import type { IInvoice } from '../../types/invoice.type'
import type { TInvoiceStatus } from '@/domains/financial/types/financial.type'

const { t } = useI18n()
const { toast } = useToast()

const { invoice } = defineProps<{
  invoice?: IInvoice | null
  invoices?: IInvoice[]
  variant?: 'button' | 'menu-item'
}>()

const emit = defineEmits<{
  updated: [invoice: IInvoice]
}>()

const loading = ref(false)

// Mirrors InvoiceStatus::canTransitionTo() in the backend (app/Domain/Financial/Enums/InvoiceStatus.php) --
// backend is authoritative and re-validates regardless, this only avoids offering options that would just 422.
const transitions: Record<TInvoiceStatus, TInvoiceStatus[]> = {
  draft: ['processing', 'cancelled'],
  processing: ['issued', 'draft', 'cancelled'],
  issued: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
}

const availableStatuses = computed<TInvoiceStatus[]>(() => invoice ? transitions[invoice.status] : [])

const changeStatus = async (newStatus: TInvoiceStatus) => {
  if (!invoice?.id) return

  loading.value = true
  try {
    const updated = await invoiceService.update(invoice.id, { status: newStatus })
    toast.success(t('invoice.actions.changeStatus.success', 'Status changed successfully'))
    emit('updated', updated)
  } catch (error) {
    handleErrorWithToast(t('invoice.actions.changeStatus.error', 'Failed to change status'), error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        v-if="variant === 'button'"
        variant="outline"
        size="sm"
        :disabled="loading || !invoice || availableStatuses.length === 0"
      >
        <RefreshCw class="size-4" />
        {{ t('invoice.actions.changeStatus.title', 'Change Status') }}
      </Button>
      <DropdownMenuItem
        v-else
        hoverable
        :disabled="loading || !invoice || availableStatuses.length === 0"
      >
        <RefreshCw class="size-4 mr-2" />
        {{ t('invoice.actions.changeStatus.title', 'Change Status') }}
      </DropdownMenuItem>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem
        v-for="status in availableStatuses"
        :key="status"
        class="cursor-pointer"
        @click="changeStatus(status)"
      >
        {{ t(`financial.invoiceStatus.${status}`, status) }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
