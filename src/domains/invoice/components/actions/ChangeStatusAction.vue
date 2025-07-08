<script setup lang="ts">
import { RefreshCw } from 'lucide-vue-next'
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
import type { IInvoice } from '../../types/invoice.type'

const { t } = useI18n()
const { toast } = useToast()

defineProps<{
  invoice?: IInvoice
  invoices?: IInvoice[]
  variant?: 'button' | 'menu-item'
}>()

const loading = ref(false)

const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'sent', label: 'Sent' },
  { value: 'paid', label: 'Paid' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'cancelled', label: 'Cancelled' },
]

const changeStatus = async (newStatus: string) => {
  loading.value = true
  try {
    // TODO: Implement service integration
    console.log('Changing status to:', newStatus)
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.success(t('invoice.actions.changeStatus.success', 'Status changed successfully'))
  } catch (error) {
    console.error('Failed to change status:', error)
    toast.error(t('invoice.actions.changeStatus.error', 'Failed to change status'))
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
        :key="status.value"
        class="cursor-pointer"
        @click="changeStatus(status.value)"
      >
        {{ t(`financial.invoiceStatus.${status.value}`, status.label) }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
