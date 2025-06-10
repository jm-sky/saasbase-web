<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import ActivityLogList from '@/components/activity-log/ActivityLogList.vue'
import { ProjectActivityLogService } from '@/domains/project/services/ProjectActivityLogService'
import { type ProjectActivityLog, ProjectActivityType } from '@/domains/project/types/activity-log'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import type { IProject } from '@/domains/project/types/project.type'

defineProps<{
  project?: IProject
}>()

const route = useRoute()
const logs = ref<ProjectActivityLog[]>([])
const loading = ref(true)

const getIcon = (log: ProjectActivityLog) => {
  switch (log.event) {
    case ProjectActivityType.AttachmentCreated:
    case ProjectActivityType.AttachmentDeleted:
    case ProjectActivityType.AttachmentUpdated:
      return 'heroicons:paper-clip'
    case ProjectActivityType.CommentCreated:
    case ProjectActivityType.CommentDeleted:
    case ProjectActivityType.CommentUpdated:
      return 'heroicons:chat-bubble-left-right'
    case ProjectActivityType.Created:
      return 'heroicons:plus-circle'
    case ProjectActivityType.Deleted:
      return 'heroicons:trash'
    case ProjectActivityType.LogoCreated:
    case ProjectActivityType.LogoDeleted:
    case ProjectActivityType.LogoUpdated:
      return 'heroicons:photo'
    case ProjectActivityType.TagAdded:
    case ProjectActivityType.TagRemoved:
    case ProjectActivityType.TagsSynced:
      return 'heroicons:tag'
    case ProjectActivityType.Updated:
      return 'heroicons:pencil-square'
    default:
      return 'heroicons:information-circle'
  }
}

const getColor = (log: ProjectActivityLog) => {
  switch (log.event) {
    case ProjectActivityType.AttachmentCreated:
    case ProjectActivityType.AttachmentDeleted:
    case ProjectActivityType.AttachmentUpdated:
      return 'bg-cyan-500'
    case ProjectActivityType.CommentCreated:
    case ProjectActivityType.CommentDeleted:
    case ProjectActivityType.CommentUpdated:
      return 'bg-indigo-500'
    case ProjectActivityType.Created:
      return 'bg-green-500'
    case ProjectActivityType.Deleted:
      return 'bg-red-500'
    case ProjectActivityType.LogoCreated:
    case ProjectActivityType.LogoDeleted:
    case ProjectActivityType.LogoUpdated:
      return 'bg-orange-500'
    case ProjectActivityType.TagAdded:
    case ProjectActivityType.TagRemoved:
    case ProjectActivityType.TagsSynced:
      return 'bg-pink-500'
    case ProjectActivityType.Updated:
      return 'bg-blue-500'
    default:
      return 'bg-gray-500'
  }
}

onMounted(async () => {
  try {
    const projectId = String(route.params.id)
    logs.value = await ProjectActivityLogService.getLogs(projectId)
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
