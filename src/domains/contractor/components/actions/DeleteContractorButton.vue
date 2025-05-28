<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast/use-toast'
import { contractorService } from '@/domains/contractor/services/ContractorService'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'

const { toast } = useToast()
const { t } = useI18n()

const props = defineProps<{
  id: string
}>()

const loading = ref(false)

const emit = defineEmits<{
  delete: [id: string]
}>()

const deleteContractor = async () => {
  if (!confirm(t('contractor.delete.confirm', 'Are you sure you want to delete this contractor?'))) return
  try {
    loading.value = true
    await contractorService.delete(props.id)
    emit('delete', props.id)
    loading.value = false
    toast.success(t('contractor.delete.success', 'Contractor deleted successfully'))
  } catch (error) {
    loading.value = false
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
