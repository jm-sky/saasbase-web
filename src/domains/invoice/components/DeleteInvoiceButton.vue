<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { useDeleteInvoice } from '@/domains/invoice/composables/useInvoiceMutations'
import { useCan } from '@/domains/rights/composables/useCan'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'

const { t } = useI18n()
const { isOwnerOrAdmin } = useCan()

const props = defineProps<{
  id: string
}>()

const emit = defineEmits<{
  deleted: [id: string]
}>()

const { mutateAsync: deleteInvoiceMutation, isPending: loading } = useDeleteInvoice()

const deleteInvoice = async () => {
  if (!confirm(t('invoice.delete.confirm', 'Are you sure you want to delete this invoice?'))) return
  try {
    await deleteInvoiceMutation(props.id)
    emit('deleted', props.id)
    toast.success(t('invoice.delete.success'))
  } catch (error) {
    handleErrorWithToast(t('invoice.delete.error', 'Failed to delete invoice'), error)
  }
}
</script>

<template>
  <Button
    v-if="isOwnerOrAdmin"
    v-tooltip="t('common.delete', 'Delete')"
    variant="destructive"
    size="sm"
    :loading
    :disabled="loading"
    @click="deleteInvoice"
  >
    <Trash2 />
  </Button>
</template>
