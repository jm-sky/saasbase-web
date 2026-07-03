<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useToast } from '@/components/ui/toast'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import type { IInvoice } from '../../types/invoice.type'
import { invoiceBatchService } from '../../services/invoiceBatchService'
import { invoiceService } from '../../services/invoiceService'
import { useInvoiceStore } from '../../stores/invoice.store'

const { t } = useI18n()
const { toast } = useToast()

const invoiceStore = useInvoiceStore()
const { invoices: invoicesStore } = storeToRefs(invoiceStore)

const { invoice, invoices } = defineProps<{
  invoice?: IInvoice
  invoices?: IInvoice[]
  iconOnly?: boolean
  variant?: 'button' | 'menu-item'
}>()

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
      await invoiceService.delete(invoice.id)
      emit('deleted', invoice.id)
      // The callback param must not be named `invoice` — it shadows the
      // component's `invoice` prop above, making `invoice.id !== invoice.id`
      // always false and wiping the entire list on every single delete.
      invoiceStore.invoices = invoicesStore.value.filter((inv) => inv.id !== invoice.id)
    } else if (invoices) {
      const ids = invoices.map(inv => inv.id)
      await invoiceBatchService.delete(ids)
      emit('deletedBatch', ids)
      invoiceStore.invoices = invoicesStore.value.filter((inv) => !ids.includes(inv.id))
    }
    toast.success(t('invoice.delete.success'))
  } catch (error) {
    loading.value = false
    handleErrorWithToast(t('invoice.delete.error', 'Failed to delete invoice'), error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <Button
    v-if="variant === 'button'"
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
    v-else
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
