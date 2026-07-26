<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { useDeleteContractor } from '@/domains/contractor/composables/useContractorMutations'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'

const { t } = useI18n()

const props = defineProps<{
  id: string
}>()

const { mutateAsync: deleteContractorMutation, isPending: loading } = useDeleteContractor()

const deleteContractor = async () => {
  if (!confirm(t('contractor.delete.confirm', 'Are you sure you want to delete this contractor?'))) return
  try {
    await deleteContractorMutation(props.id)
    toast.success(t('contractor.delete.success', 'Contractor deleted successfully'))
  } catch (error) {
    handleErrorWithToast(t('contractor.delete.error', 'Failed to delete contractor'), error)
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
    @click="deleteContractor"
  >
    <Trash2 />
  </Button>
</template>
