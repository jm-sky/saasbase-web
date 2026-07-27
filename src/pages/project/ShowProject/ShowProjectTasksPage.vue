<script setup lang="ts">
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import NoItems from '@/components/DataLists/NoItems.vue'
import Skeleton from '@/components/ui/skeleton/Skeleton.vue'
import TaskCard from '@/domains/project/components/TaskCard.vue'
import { useTaskList } from '@/domains/task/composables/useTaskQueries'
import { type ITaskFilters } from '@/domains/task/services/taskService'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import type { IProject } from '@/domains/project/types/project.type'

const { t } = useI18n()

const { project } = defineProps<{
  project: IProject
}>()

const filters = computed<ITaskFilters>(() => ({
  filter: {
    projectId: {
      value: project.id,
    },
  },
}))

const { data: response, isPending: loading, isError, error } = useTaskList(filters)

const tasks = computed(() => response.value?.data ?? [])

watch(isError, (failed) => {
  if (failed) {
    handleErrorWithToast(t('project.tasks.loadError'), error.value)
  }
})
</script>

<template>
  <div class="flex flex-col gap-2 border rounded-md p-4 shadow-lg/5">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <TaskCard v-for="task in tasks" :key="task.id" :task="task" />

      <template v-if="loading && tasks.length === 0">
        <Skeleton class="min-h-30 rounded-lg" />
      </template>

      <NoItems v-if="!loading && tasks.length === 0" />
    </div>
  </div>
</template>
