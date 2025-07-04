<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import NoItems from '@/components/DataLists/NoItems.vue'
import Skeleton from '@/components/ui/skeleton/Skeleton.vue'
import TaskCard from '@/domains/project/components/TaskCard.vue'
import { type ITaskFilters, taskService } from '@/domains/task/services/taskService'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import type { IProject } from '@/domains/project/types/project.type'
import type { ITask } from '@/domains/task/types/task.type'

const { project } = defineProps<{
  project: IProject
}>()

const loading = ref(false)
const tasks = ref<ITask[]>([])

const filters = computed<ITaskFilters>(() => ({
  filter: {
    projectId: {
      value: project.id,
    },
  },
}))

const getTasks = async () => {
  try {
    loading.value = true
    const response = await taskService.index(filters.value)
    tasks.value = response.data
  } catch (error) {
    handleErrorWithToast('Could not load tasks', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await getTasks()
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
