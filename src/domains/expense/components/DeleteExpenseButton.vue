<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { useDeleteExpense } from '@/domains/expense/composables/useExpenseMutations'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'

const { t } = useI18n()

const props = defineProps<{
  id: string
}>()

const { mutateAsync: deleteExpenseMutation, isPending: loading } = useDeleteExpense()

const deleteExpense = async () => {
  if (!confirm(t('expense.delete.confirm', 'Are you sure you want to delete this expense?'))) return
  try {
    await deleteExpenseMutation(props.id)
    toast.success(t('expense.delete.success'))
  } catch (error) {
    handleErrorWithToast(t('expense.delete.error', 'Failed to delete expense'), error)
  }
}
</script>

<template>
  <Button
    v-tooltip="t('common.delete', 'Delete')"
    variant="destructive"
    size="sm"
    :loading
    :disabled="loading"
    @click="deleteExpense"
  >
    <Trash2 />
  </Button>
</template>
