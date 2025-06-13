<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import CommentItem from '@/domains/comment/components/CommentItem.vue'
import { productCommentsService } from '@/domains/product/services/ProductCommentsService'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import type { IProject } from '../../types/project.type'
import type { IComment } from '@/domains/comment/types/comment.type'

const { t } = useI18n()

const loading = ref(false)

const { project, comment } = defineProps<{
  project: IProject
  comment: IComment
}>()

const emit = defineEmits<{
  refresh: []
}>()

const handleEdit = (comment: IComment) => {
  console.log(comment)
}

const handleDelete = async (comment: IComment) => {
  try {
    if (!confirm(t('comments.delete.confirmation'))) return
    loading.value = true
    await productCommentsService.delete(project.id, comment.id)
    emit('refresh')
  } catch (err) {
    handleErrorWithToast(t('comments.delete.error'), err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <CommentItem :comment="comment" @edit="handleEdit" @delete="handleDelete" />
</template>
