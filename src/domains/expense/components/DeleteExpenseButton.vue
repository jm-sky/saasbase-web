<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast/use-toast'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { expenseService } from '../services/expenseService'
import { useExpenseStore } from '../stores/expense.store'

const { toast } = useToast()
const { t } = useI18n()

const expenseStore = useExpenseStore()
const { expenses } = storeToRefs(expenseStore)

const props = defineProps<{
  id: string
}>()

const loading = ref(false)

const emit = defineEmits<{
  deleted: [id: string]
}>()

const deleteExpense = async () => {
  if (!confirm(t('expense.delete.confirm', 'Are you sure you want to delete this expense?'))) return
  try {
    loading.value = true
    await expenseService.delete(props.id)
    loading.value = false
    emit('deleted', props.id)
    expenseStore.expenses = expenses.value.filter((expense) => expense.id !== props.id)
    toast.success(t('expense.delete.success'))
  } catch (error) {
    loading.value = false
    handleErrorWithToast(t('expense.delete.error', 'Failed to delete expense'), error)
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
    @click="deleteExpense"
  >
    <Trash2 />
  </Button>
</template>
