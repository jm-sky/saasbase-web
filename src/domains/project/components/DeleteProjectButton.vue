<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast/use-toast'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { projectService } from '../services/ProjectService'

const { toast } = useToast()
const { t } = useI18n()

const props = defineProps<{
  id: string
}>()

const loading = ref(false)

const emit = defineEmits<{
  deleted: [id: string]
}>()

const deleteProject = async () => {
  if (!confirm(t('project.delete.confirm', 'Are you sure you want to delete this project?'))) return
  try {
    loading.value = true
    await projectService.delete(props.id)
    loading.value = false
    emit('deleted', props.id)
    toast.success(t('project.delete.success'))
  } catch (error) {
    loading.value = false
    handleErrorWithToast(t('project.delete.error', 'Failed to delete project'), error)
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
    @click="deleteProject"
  >
    <Trash2 />
  </Button>
</template>
