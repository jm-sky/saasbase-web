<script setup lang="ts">
import { RefreshCw } from 'lucide-vue-next'
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import ButtonLink from '@/components/ButtonLink.vue'
import DataListsWrapper from '@/components/DataLists/DataListsWrapper.vue'
import DataTable from '@/components/DataLists/DataTable.vue'
import SearchField from '@/components/DataLists/Filters/SearchField.vue'
import { Button } from '@/components/ui/button'
import DeleteProjectButton from '@/domains/project/components/DeleteProjectButton.vue'
import EditProjectButton from '@/domains/project/components/EditProjectButton.vue'
import { type IProjectFilters, projectService } from '@/domains/project/services/ProjectService'
import { useProjectStore } from '@/domains/project/stores/project.store'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { toDateString } from '@/lib/toDateString'
import { toDateTimeString } from '@/lib/toDateTimeString'
import type { ColumnDef } from '@tanstack/vue-table'
import type { IProject } from '@/domains/project/types/project.type'
import type { IResourceMeta } from '@/domains/shared/types/resource.type'

const { t } = useI18n()
const projectStore = useProjectStore()

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

const columns: ColumnDef<IProject>[] = [
  {
    accessorKey: 'name',
    header: t('project.fields.name'),
  },
  {
    accessorKey: 'description',
    header: t('project.fields.description'),
  },
  {
    accessorKey: 'startDate',
    header: t('project.fields.startDate'),
    cell: (info: { row: { original: IProject } }) => toDateString(info.row.original.startDate),
  },
  {
    accessorKey: 'endDate',
    header: t('project.fields.endDate'),
    cell: (info: { row: { original: IProject } }) => info.row.original.endDate ? toDateString(info.row.original.endDate) : '-',
  },
  {
    accessorKey: 'createdAt',
    header: t('project.fields.createdAt'),
    cell: (info: { row: { original: IProject } }) => toDateTimeString(info.row.original.createdAt),
  },
  {
    id: 'actions',
    header: t('common.actions'),
  },
]

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
      <DataTable
        v-model:page="filters.page"
        v-model:page-size="filters.perPage"
        :columns="columns"
        :data="projects"
        :total="meta.total"
        :page-size-options="[10, 20, 30, 40, 50]"
      >
        <template #name="{ data }">
          <ButtonLink :to="`/projects/${data.id}/show/overview`">
            {{ data.name }}
          </ButtonLink>
        </template>
        <template #description="{ data }">
          <div class="text-ellipsis overflow-hidden whitespace-nowrap max-w-48">
            {{ data.description?.slice(0, 100) ?? '-' }}
          </div>
        </template>
        <template #actions="{ data }">
          <div class="flex gap-2 justify-end w-full whitespace-nowrap min-w-0">
            <EditProjectButton :id="data.id" @click="projectStore.setProject(data)" />
            <DeleteProjectButton :id="data.id" @deleted="refresh" />
          </div>
        </template>
        <template #actions-header>
          <div class="w-full text-right">
            {{ t('actions') }}
          </div>
        </template>
      </DataTable>
    </DataListsWrapper>
  </AuthenticatedLayout>
</template>
