<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import CommentItem from '@/domains/comment/components/CommentItem.vue'
import { productCommentsService } from '@/domains/product/services/ProductCommentsService'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import type { IComment } from '@/domains/comment/models/comment.model'
import type { IProduct } from '@/domains/product/models/product.model'

const { t } = useI18n()

const loading = ref(false)

const { product, comment } = defineProps<{
  product: IProduct
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
    await productCommentsService.delete(product.id, comment.id)
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
