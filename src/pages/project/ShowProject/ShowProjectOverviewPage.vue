<script setup lang="ts">
import ProjectAttachmentsList from '@/domains/project/components/attachments/ProjectAttachmentsList.vue'
import type { IProject } from '@/domains/project/types/project.type'

defineProps<{
  project?: IProject
}>()
</script>

<template>
  <div class="flex flex-col gap-2 border rounded-md p-4 shadow-lg/5">
    <div class="font-bold">
      Description
    </div>
    <div class="text-muted-foreground">
      {{ project?.description }}
    </div>
  </div>

  <div class="border rounded-md p-2 shadow-lg/5">
    <ProjectAttachmentsList />
  </div>
</template>
