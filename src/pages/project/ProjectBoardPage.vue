<script setup lang="ts">
import { RefreshCw } from 'lucide-vue-next'
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import ButtonLink from '@/components/ButtonLink.vue'
import DataListsWrapper from '@/components/DataLists/DataListsWrapper.vue'
import SearchField from '@/components/DataLists/Filters/SearchField.vue'
import { Button } from '@/components/ui/button'
import Skeleton from '@/components/ui/skeleton/Skeleton.vue'
import AddProjectCard from '@/domains/project/components/AddProjectCard.vue'
import ProjectCard from '@/domains/project/components/ProjectCard.vue'
import { type IProjectFilters, projectService } from '@/domains/project/services/ProjectService'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import type { IProject } from '@/domains/project/types/project.type'
import type { IResourceMeta } from '@/domains/shared/types/resource.type'

const { t } = useI18n()

const projects = ref<IProject[]>([])
const meta = ref<IResourceMeta>({
  currentPage: 1,
  lastPage: 1,
  perPage: 10,
  total: 0,
})
const loading = ref(false)
const error = ref<string | null>(null)
const filters = ref<IProjectFilters>({
  search: '',
  page: 1,
  perPage: 10,
})

const refresh = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await projectService.index(filters.value)
    projects.value = response.data
    meta.value = response.meta
  } catch (err) {
    error.value = 'Failed to load projects'
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  void refresh()
})

watch(filters, () => refresh(), { deep: true })
</script>

<template>
  <AuthenticatedLayout>
    <DataListsWrapper :title="t('project.title')" :loading :error>
      <template #actions>
        <SearchField v-model="filters.search" />
        <Button variant="outline" @click="refresh">
          <RefreshCw class="size-4" />
        </Button>
        <ButtonLink v-tooltip="t('project.add.description')" variant="default" to="/projects/add">
          {{ t('project.add.title') }}
        </ButtonLink>
      </template>

      <div class="grid grid-cols-4 gap-4">
        <ProjectCard v-for="project in projects" :key="project.id" :project />

        <template v-if="loading &&projects.length === 0">
          <template v-for="i in 4" :key="i">
            <Skeleton class="min-h-40 rounded-lg" />
          </template>
        </template>

        <AddProjectCard />
      </div>
    </DataListsWrapper>
  </AuthenticatedLayout>
</template>
