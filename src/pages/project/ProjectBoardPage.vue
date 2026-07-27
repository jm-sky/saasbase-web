<script setup lang="ts">
import { RefreshCw } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ButtonLink from '@/components/ButtonLink.vue'
import DataListsWrapper from '@/components/DataLists/DataListsWrapper.vue'
import SearchField from '@/components/DataLists/Filters/SearchField.vue'
import { Button } from '@/components/ui/button'
import Skeleton from '@/components/ui/skeleton/Skeleton.vue'
import AddProjectCard from '@/domains/project/components/AddProjectCard.vue'
import ProjectCard from '@/domains/project/components/ProjectCard.vue'
import { useProjectList } from '@/domains/project/composables/useProjectQueries'
import { type IProjectFilters } from '@/domains/project/services/ProjectService'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'

const { t } = useI18n()

const filters = ref<IProjectFilters>({
  search: '',
  page: 1,
  perPage: 10,
})

const { data: response, isPending: loading, isError, refetch } = useProjectList(filters)

const projects = computed(() => response.value?.data ?? [])
const error = computed(() => isError.value ? t('project.list.error', 'Failed to load projects') : null)
</script>

<template>
  <AuthenticatedLayout>
    <DataListsWrapper :title="t('project.title')" :loading :error>
      <template #actions>
        <SearchField v-model="filters.search" />
        <Button variant="outline" @click="refetch()">
          <RefreshCw class="size-4" />
        </Button>
        <ButtonLink v-tooltip="t('project.add.description')" variant="default" to="/projects/add">
          {{ t('project.add.title') }}
        </ButtonLink>
      </template>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <ProjectCard v-for="project in projects" :key="project.id" :project />

        <template v-if="loading && projects.length === 0">
          <template v-for="i in 4" :key="i">
            <Skeleton class="min-h-30 rounded-lg" />
          </template>
        </template>

        <AddProjectCard />
      </div>
    </DataListsWrapper>
  </AuthenticatedLayout>
</template>
