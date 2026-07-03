<script setup lang="ts">
import { RefreshCw } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/components/ui/toast'
import { invoiceStatuses } from '@/domains/financial/data/statuses'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import type { IInvoice } from '../../types/invoice.type'
import { invoiceService } from '../../services/invoiceService'
import { useInvoiceStore } from '../../stores/invoice.store'
import type { TInvoiceStatus } from '@/domains/financial/types/financial.type'

const { t } = useI18n()
const { toast } = useToast()

const invoiceStore = useInvoiceStore()
const { invoices: invoicesStore } = storeToRefs(invoiceStore)

const props = defineProps<{
  invoice?: IInvoice
  invoices?: IInvoice[]
  variant?: 'button' | 'menu-item'
}>()

const emit = defineEmits<{
  changed: [ids: string[], status: TInvoiceStatus]
}>()

const loading = ref(false)

// Must match the backend InvoiceStatus enum (draft/processing/issued/
// completed/cancelled) — this list previously used unrelated values
// (draft/sent/paid/overdue/cancelled) that the backend would reject.
const statusOptions = invoiceStatuses

const changeStatus = async (newStatus: TInvoiceStatus) => {
  const targets = props.invoice ? [props.invoice] : (props.invoices ?? [])

  if (!targets.length) return

  loading.value = true
  try {
    await Promise.all(targets.map(target => invoiceService.update(target.id, { status: newStatus })))

    const ids = targets.map(target => target.id)
    invoiceStore.invoices = invoicesStore.value.map(inv => ids.includes(inv.id) ? { ...inv, status: newStatus } : inv)

    emit('changed', ids, newStatus)
    toast.success(t('invoice.actions.changeStatus.success', 'Status changed successfully'))
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
        :disabled="loading || (!invoice && !invoices?.length)"
      >
        <RefreshCw class="size-4" />
        {{ t('invoice.actions.changeStatus.title', 'Change Status') }}
      </Button>
      <DropdownMenuItem
        v-else
        hoverable
        :disabled="loading || (!invoice && !invoices?.length)"
      >
        <RefreshCw class="size-4 mr-2" />
        {{ t('invoice.actions.changeStatus.title', 'Change Status') }}
      </DropdownMenuItem>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem
        v-for="status in statusOptions"
        :key="status"
        class="cursor-pointer"
        @click="changeStatus(status)"
      >
        {{ t(`financial.invoiceStatus.${status}`) }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
