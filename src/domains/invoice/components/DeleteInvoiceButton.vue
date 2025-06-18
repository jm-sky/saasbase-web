<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast/use-toast'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { invoiceService } from '../services/invoiceService'
import { useInvoiceStore } from '../stores/invoice.store'

const { toast } = useToast()
const { t } = useI18n()

const invoiceStore = useInvoiceStore()
const { invoices } = storeToRefs(invoiceStore)

const props = defineProps<{
  id: string
}>()

const loading = ref(false)

const emit = defineEmits<{
  deleted: [id: string]
}>()

const deleteInvoice = async () => {
  if (!confirm(t('invoice.delete.confirm', 'Are you sure you want to delete this invoice?'))) return
  try {
    loading.value = true
    await invoiceService.delete(props.id)
    loading.value = false
    emit('deleted', props.id)
    toast.success(t('invoice.delete.success'))
    invoiceStore.invoices = invoices.value.filter((invoice) => invoice.id !== props.id)
  } catch (error) {
    loading.value = false
    handleErrorWithToast(t('invoice.delete.error', 'Failed to delete invoice'), error)
  }
}
</script>

<template>
  <Button
    v-tooltip="t('common.delete', 'Delete')"
    variant="destructive"
    size="sm"
    :loading="loading"
    :disabled="loading"
    @click="deleteInvoice"
  >
    <Trash2 />
  </Button>
</template>
