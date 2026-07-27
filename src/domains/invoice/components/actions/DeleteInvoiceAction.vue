<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next'
import { useQueryClient } from '@tanstack/vue-query'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { toast } from '@/components/ui/toast'
import { useDeleteInvoice } from '@/domains/invoice/composables/useInvoiceMutations'
import { invoiceKeys } from '@/domains/invoice/composables/queryKeys'
import { useCan } from '@/domains/rights/composables/useCan'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { invoiceBatchService } from '../../services/invoiceBatchService'
import type { IInvoice } from '../../types/invoice.type'

const { t } = useI18n()
const { isOwnerOrAdmin } = useCan()
const queryClient = useQueryClient()

const { invoice, invoices } = defineProps<{
  invoice?: IInvoice
  invoices?: IInvoice[]
  iconOnly?: boolean
  variant?: 'button' | 'menu-item'
}>()

const { mutateAsync: deleteInvoiceMutation } = useDeleteInvoice()
const loading = ref(false)

const emit = defineEmits<{
  deleted: [id: string]
  deletedBatch: [ids: string[]]
}>()

const deleteInvoice = async () => {
  if (!confirm(t('invoice.delete.confirm', 'Are you sure you want to delete this invoice?'))) return
  try {
    loading.value = true
    if (invoice) {
      await deleteInvoiceMutation(invoice.id)
      emit('deleted', invoice.id)
    } else if (invoices) {
      const ids = invoices.map(inv => inv.id)
      await invoiceBatchService.delete(ids)
      void queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() })
      emit('deletedBatch', ids)
    }
    toast.success(t('invoice.delete.success'))
  } catch (error) {
    handleErrorWithToast(t('invoice.delete.error', 'Failed to delete invoice'), error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <Button
    v-if="isOwnerOrAdmin && variant === 'button'"
    v-tooltip="t('common.delete', 'Delete')"
    variant="outline-destructive"
    size="sm"
    :disabled="loading || (!invoice && !invoices?.length)"
    @click="deleteInvoice"
  >
    <Trash2 class="size-4" />
    <template v-if="!iconOnly">
      {{ t('invoice.actions.delete.title', 'Delete') }}
    </template>
  </Button>
  <DropdownMenuItem
    v-else-if="isOwnerOrAdmin"
    hoverable
    :disabled="loading || (!invoice && !invoices?.length)"
    @click="deleteInvoice"
  >
    <Trash2 class="size-4" :class="{ 'mr-2': !iconOnly }" />
    <template v-if="!iconOnly">
      {{ t('invoice.actions.delete.title', 'Delete') }}
    </template>
  </DropdownMenuItem>
</template>
