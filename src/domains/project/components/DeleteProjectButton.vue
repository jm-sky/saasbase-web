<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { useDeleteProject } from '@/domains/project/composables/useProjectMutations'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'

const { t } = useI18n()

const props = defineProps<{
  id: string
}>()

const { mutateAsync: deleteProjectMutation, isPending: loading } = useDeleteProject()

const deleteProject = async () => {
  if (!confirm(t('project.delete.confirm', 'Are you sure you want to delete this project?'))) return
  try {
    await deleteProjectMutation(props.id)
    toast.success(t('project.delete.success'))
  } catch (error) {
    handleErrorWithToast(t('project.delete.error', 'Failed to delete project'), error)
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
    @click="deleteProject"
  >
    <Trash2 />
  </Button>
</template>
