<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import ActivityLogList from '@/components/activity-log/ActivityLogList.vue'
import { ProductActivityLogService } from '@/domains/product/services/ProductActivityLogService'
import { type ProductActivityLog, ProductActivityType } from '@/domains/product/types/activity-log'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import type { IProduct } from '@/domains/product/types/product.type'

defineProps<{
  product?: IProduct
}>()

const route = useRoute()
const logs = ref<ProductActivityLog[]>([])
const loading = ref(true)

const getIcon = (log: ProductActivityLog) => {
  switch (log.event) {
    case ProductActivityType.AttachmentCreated:
    case ProductActivityType.AttachmentDeleted:
    case ProductActivityType.AttachmentUpdated:
      return 'heroicons:paper-clip'
    case ProductActivityType.CommentCreated:
    case ProductActivityType.CommentDeleted:
    case ProductActivityType.CommentUpdated:
      return 'heroicons:chat-bubble-left-right'
    case ProductActivityType.Created:
      return 'heroicons:plus-circle'
    case ProductActivityType.Deleted:
      return 'heroicons:trash'
    case ProductActivityType.LogoCreated:
    case ProductActivityType.LogoDeleted:
    case ProductActivityType.LogoUpdated:
      return 'heroicons:photo'
    case ProductActivityType.TagAdded:
    case ProductActivityType.TagRemoved:
    case ProductActivityType.TagsSynced:
      return 'heroicons:tag'
    case ProductActivityType.Updated:
      return 'heroicons:pencil-square'
    default:
      return 'heroicons:information-circle'
  }
}

const getColor = (log: ProductActivityLog) => {
  switch (log.event) {
    case ProductActivityType.AttachmentCreated:
    case ProductActivityType.AttachmentDeleted:
    case ProductActivityType.AttachmentUpdated:
      return 'bg-cyan-500'
    case ProductActivityType.CommentCreated:
    case ProductActivityType.CommentDeleted:
    case ProductActivityType.CommentUpdated:
      return 'bg-indigo-500'
    case ProductActivityType.Created:
      return 'bg-green-500'
    case ProductActivityType.Deleted:
      return 'bg-red-500'
    case ProductActivityType.LogoCreated:
    case ProductActivityType.LogoDeleted:
    case ProductActivityType.LogoUpdated:
      return 'bg-orange-500'
    case ProductActivityType.TagAdded:
    case ProductActivityType.TagRemoved:
    case ProductActivityType.TagsSynced:
      return 'bg-pink-500'
    case ProductActivityType.Updated:
      return 'bg-blue-500'
    default:
      return 'bg-gray-500'
  }
}

onMounted(async () => {
  try {
    const productId = String(route.params.id)
    logs.value = await ProductActivityLogService.getLogs(productId)
  } catch (error) {
    handleErrorWithToast('Failed to load activity logs', error)
    console.warn(error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="flex flex-col gap-2 border rounded-md p-4 shadow-lg/5">
    <h2 class="font-bold">
      Logs
    </h2>

    <ActivityLogList
      v-if="!loading"
      :logs="logs"
      :get-icon="getIcon"
      :get-color="getColor"
    />
    <div v-else class="flex items-center justify-center py-12">
      <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  </div>
</template>
