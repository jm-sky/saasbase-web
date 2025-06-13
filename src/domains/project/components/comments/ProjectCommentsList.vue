<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import NoItems from '@/components/DataLists/NoItems.vue'
import Button from '@/components/ui/button/Button.vue'
import TablePagination from '@/components/ui/table/TablePagination.vue'
import CommentForm from '@/domains/comment/components/CommentForm.vue'
import { productCommentsService } from '@/domains/product/services/ProductCommentsService'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import type { IProject } from '../../types/project.type'
import { projectCommentsService } from '../../services/ProjectCommentsService'
import ProjectCommentsListItem from './ProjectCommentsListItem.vue'
import type { IComment } from '@/domains/comment/types/comment.type'

const { t } = useI18n()

const { project } =defineProps<{
  project: IProject
}>()

const comments = ref<IComment[]>([])
const loading = ref(false)
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const pageSizeOptions = [10, 20, 50]

const refresh = async () => {
  loading.value = true
  try {
    const res = await projectCommentsService.index(project.id, page.value, pageSize.value)
    comments.value = res.data
    total.value = res.meta.total
  } catch (err) {
    handleErrorWithToast(t('comments.list.error'), err)
  } finally {
    loading.value = false
  }
}

onMounted(refresh)
</script>

<template>
  <div class="flex flex-col gap-4" :class="{ 'opacity-50': loading }">
    <div class="flex flex-row items-center justify-between">
      <div class="flex flex-row items-center gap-2">
        <div class="font-bold">
          {{ t('comments.title') }}
        </div>
      </div>
      <Button :loading variant="ghost" @click="refresh">
        <Icon icon="lucide:refresh-cw" />
      </Button>
    </div>

    <div v-if="comments.length === 0" class="flex justify-center py-4 text-muted-foreground">
      <NoItems :message="t('comments.list.empty')" />
    </div>

    <div v-else class="flex flex-col gap-4">
      <ProjectCommentsListItem
        v-for="comment in comments"
        :key="comment.id"
        :project
        :comment
        @refresh="refresh"
      />

      <TablePagination
        v-model:page="page"
        v-model:page-size="pageSize"
        :total="total"
        :page-count="Math.ceil(total / pageSize)"
        :page-size-options="pageSizeOptions"
        class="border rounded-md my-4"
        @update:page="refresh"
        @update:page-size="refresh"
      />
    </div>

    <CommentForm
      :commentable-id="project.id"
      :service="productCommentsService"
      @create="refresh"
    />
  </div>
</template>
