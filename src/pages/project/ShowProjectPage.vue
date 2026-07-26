<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import EntityDetailsLayout from '@/components/layouts/EntityDetailsLayout.vue'
import TabLink from '@/components/ui/tabs/TabLink.vue'
import ProjectSidebar from '@/domains/project/components/ProjectSidebar.vue'
import { useProject } from '@/domains/project/composables/useProjectQueries'
import { useProjectStore } from '@/domains/project/stores/project.store'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'

const { t } = useI18n()
const route = useRoute()

const projectId = route.params.id as string
const projectStore = useProjectStore()
const { project: storeProject } = storeToRefs(projectStore)

const { data: project, isPending: loading, refetch } = useProject(projectId)

watch(project, (value) => {
  if (value) projectStore.setProject(value)
}, { immediate: true })

const displayProject = computed(() => project.value ?? storeProject.value)

const tabs = computed(() => [
  {
    to: `/projects/${projectId}/show/overview`,
    label: t('project.overview.title'),
  },
  {
    to: `/projects/${projectId}/show/tasks`,
    label: t('project.tasks.title'),
  },
  {
    to: `/projects/${projectId}/show/comments`,
    label: t('project.comments.title'),
  },
  {
    to: `/projects/${projectId}/show/logs`,
    label: t('project.logs.title'),
  },
])
</script>

<template>
  <AuthenticatedLayout>
    <EntityDetailsLayout
      :title="t('project.projectDetails')"
      :back-link="'/projects'"
      :edit-link="`/projects/${projectId}/edit`"
      :name="displayProject?.name"
      :logo="displayProject?.logoUrl"
      :loading
      show-sidebar
      @refresh="refetch()"
    >
      <template #back-link-text>
        {{ t('project.title') }}
      </template>

      <template #sidebar>
        <ProjectSidebar :project-id="projectId" :project="displayProject" />
      </template>

      <template #tabs>
        <TabLink
          v-for="tab in tabs"
          :key="tab.to"
          :to="tab.to"
          :label="tab.label"
        />
      </template>

      <template #content>
        <RouterView v-if="displayProject" :project="displayProject" />
      </template>
    </EntityDetailsLayout>
  </AuthenticatedLayout>
</template>
