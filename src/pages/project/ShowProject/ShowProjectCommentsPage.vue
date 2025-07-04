<script setup lang="ts">
import ProjectCommentsList from '@/domains/project/components/comments/ProjectCommentsList.vue'
import type { IProject } from '@/domains/project/types/project.type'

const { project } = defineProps<{
  project: IProject
}>()
</script>

<template>
  <div class="flex flex-col gap-2 border rounded-md p-4 shadow-lg/5">
    <ProjectCommentsList :project />
  </div>
</template>
