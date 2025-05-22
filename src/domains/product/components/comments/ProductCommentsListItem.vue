<script setup lang="ts">
import { Pencil, Trash2 } from 'lucide-vue-next'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Avatar from '@/components/ui/avatar/Avatar.vue'
import AvatarFallback from '@/components/ui/avatar/AvatarFallback.vue'
import AvatarImage from '@/components/ui/avatar/AvatarImage.vue'
import Button from '@/components/ui/button/Button.vue'
import { useAuthStore } from '@/domains/auth/store/auth.store'
import { productCommentsService } from '@/domains/product/services/ProductCommentsService'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import type { IComment } from '@/domains/comment/models/comment.model'
import type { IProduct } from '@/domains/product/models/product.model'

const { t } = useI18n()
const authStore = useAuthStore()

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

const formatDate = (date: string) => {
  return new Date(date).toLocaleString()
}
</script>

<template>
  <div
    class="flex flex-row gap-4"
    :class="{ 'opacity-50': loading }"
  >
    <div class="w-28 flex flex-col items-center text-center justify-center gap-1">
      <Avatar size="base" class="">
        <AvatarImage :src="comment.user?.avatarUrl ?? ''" :alt="comment.user?.name" />
        <AvatarFallback>{{ comment.user?.name.slice(0, 2) ?? 'X' }}</AvatarFallback>
      </Avatar>
      <div class="font-medium text-sm">
        {{ comment.user?.name }}
      </div>
    </div>

    <div class="w-full flex flex-col gap-2 border rounded-xl px-4 py-2" :class="{ 'border-primary/50': comment.user?.id === authStore.user?.id }">
      <div class="flex flex-row items-center justify-between gap-2">
        <div class="text-sm text-muted-foreground">
          {{ formatDate(comment.createdAt) }}
        </div>
        <div v-if="comment.meta?.canEdit || comment.meta?.canDelete" class="flex flex-row gap-2">
          <Button
            variant="ghost"
            size="icon"
            :disabled="loading || !comment.meta?.canEdit"
            @click="handleEdit(comment)"
          >
            <Pencil class="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            :disabled="loading || !comment.meta?.canDelete"
            @click="handleDelete(comment)"
          >
            <Trash2 class="size-4" />
          </Button>
        </div>
      </div>
      <div class="text-muted-foreground">
        {{ comment.content }}
      </div>
    </div>
  </div>
</template>
