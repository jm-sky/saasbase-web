<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import CommentItem from '@/domains/comment/components/CommentItem.vue'
import { contractorCommentsService } from '@/domains/contractor/services/ContractorCommentsService'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import type { IComment } from '@/domains/comment/models/comment.model'
import type { IContractor } from '@/domains/contractor/types/contractor.type'

const { t } = useI18n()

const loading = ref(false)

const { contractor, comment } = defineProps<{
  contractor: IContractor
  comment: IComment
}>()

const emit = defineEmits<{
  refresh: []
}>()

const handleEdit = (comment: IComment) => {
  // TODO: Implement edit
  console.log(comment)
}

const handleDelete = async (comment: IComment) => {
  try {
    if (!confirm(t('comments.delete.confirmation'))) return
    loading.value = true
    await contractorCommentsService.delete(contractor.id, comment.id)
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
