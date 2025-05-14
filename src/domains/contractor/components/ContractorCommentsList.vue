<script setup lang="ts">
import { MessageSquare, Pencil, Trash2 } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import Button from '@/components/ui/button/Button.vue'
import TablePagination from '@/components/ui/table/TablePagination.vue'
import { contractorCommentsService, type IContractorComment } from '@/domains/contractor/services/ContractorCommentsService'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'

const { t } = useI18n()
const route = useRoute()
const contractorId = route.params.id as string

const comments = ref<IContractorComment[]>([])
const loading = ref(false)
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const pageSizeOptions = [10, 20, 50]

const fetchComments = async () => {
  loading.value = true
  try {
    const res = await contractorCommentsService.index(contractorId, page.value, pageSize.value)
    comments.value = res.data
    total.value = res.total
  } catch (err) {
    handleErrorWithToast(t('contractor.comments.error'), err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchComments)

const handleAdd = () => {
  // TODO: implement modal/form
}

const handleEdit = (_comment: IContractorComment) => {
  // TODO: implement modal/form
  console.log(_comment)
}

const handleDelete = async (comment: IContractorComment) => {
  try {
    await contractorCommentsService.delete(contractorId, comment.id)
    await fetchComments()
  } catch (err) {
    handleErrorWithToast(t('contractor.comments.deleteError'), err)
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleString()
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-row items-center justify-between">
      <div class="flex flex-row items-center gap-2">
        <MessageSquare class="size-5" />
        <div class="font-bold">
          Comments
        </div>
      </div>
      <Button
        variant="default"
        @click="handleAdd"
      >
        Add Comment
      </Button>
    </div>

    <div v-if="loading" class="flex justify-center py-4">
      Loading...
    </div>
    <div v-else-if="comments.length === 0" class="flex justify-center py-4 text-muted-foreground">
      No comments yet
    </div>
    <div v-else class="flex flex-col gap-4">
      <div
        v-for="comment in comments"
        :key="comment.id"
        class="flex flex-col gap-2 border rounded-md p-4"
      >
        <div class="flex flex-row items-start justify-between">
          <div class="flex flex-col gap-1">
            <div class="font-medium">
              {{ comment.createdBy.name }}
            </div>
            <div class="text-sm text-muted-foreground">
              {{ formatDate(comment.createdAt) }}
            </div>
          </div>
          <div class="flex flex-row gap-2">
            <Button
              variant="ghost"
              size="icon"
              @click="handleEdit(comment)"
            >
              <Pencil class="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
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

      <TablePagination
        v-model:page="page"
        v-model:page-size="pageSize"
        :total="total"
        :page-count="Math.ceil(total / pageSize)"
        :page-size-options="pageSizeOptions"
        @update:page="fetchComments"
        @update:page-size="fetchComments"
      />
    </div>
  </div>
</template>
