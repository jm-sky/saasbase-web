<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import EntityDetailsLayout from '@/components/layouts/EntityDetailsLayout.vue'
import ProjectSidebar from '@/domains/project/components/ProjectSidebar.vue'
import { projectService } from '@/domains/project/services/ProjectService'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import type { IProject } from '@/domains/project/types/project.type'

const { t } = useI18n()
const route = useRoute()
const projectId = route.params.id as string

const project = ref<IProject>()
const loading = ref(false)
const error = ref<string | null>(null)

const refresh = async () => {
  try {
    loading.value = true
    error.value = null
    project.value = await projectService.get(projectId)
  } catch (err) {
    handleErrorWithToast(t('project.show.error'), err)
    error.value = 'Failed to load project'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await refresh()
})
</script>

<template>
  <AuthenticatedLayout>
    <EntityDetailsLayout
      v-if="project"
      :title="t('project.projectDetails')"
      :back-link="'/projects'"
      :edit-link="`/projects/${projectId}/edit`"
      :name="project.name"
      :logo="project.logoUrl"
      :loading
      @refresh="refresh"
    >
      <template #back-link-text>
        {{ t('project.title') }}
      </template>

      <template #sidebar>
        <ProjectSidebar :project-id="projectId" :project />
      </template>

      <template #tabs>
        <RouterLink
          :to="`/projects/${projectId}/show/overview`"
          class="border-b-2 border-transparent hover:border-muted-foreground px-2 py-1"
          exact-active-class="text-primary border-primary!"
        >
          {{ t('project.overview.title') }}
        </RouterLink>
        <RouterLink
          :to="`/projects/${projectId}/show/comments`"
          class="border-b-2 border-transparent hover:border-muted-foreground px-2 py-1"
          exact-active-class="text-primary border-primary!"
        >
          {{ t('project.comments.title') }}
        </RouterLink>
        <RouterLink
          :to="`/projects/${projectId}/show/logs`"
          class="border-b-2 border-transparent hover:border-muted-foreground px-2 py-1"
          exact-active-class="text-primary border-primary!"
        >
          {{ t('project.logs.title') }}
        </RouterLink>
      </template>

      <template #content>
        <RouterView v-if="project" :project />
      </template>
    </EntityDetailsLayout>
  </AuthenticatedLayout>
</template>
