<script setup lang="ts">
import { RefreshCw } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ButtonLink from '@/components/ButtonLink.vue'
import DataListsWrapper from '@/components/DataLists/DataListsWrapper.vue'
import DataTable from '@/components/DataLists/DataTable.vue'
import SearchField from '@/components/DataLists/Filters/SearchField.vue'
import { Button } from '@/components/ui/button'
import DeleteProjectButton from '@/domains/project/components/DeleteProjectButton.vue'
import EditProjectButton from '@/domains/project/components/EditProjectButton.vue'
import { useProjectList } from '@/domains/project/composables/useProjectQueries'
import { type IProjectFilters } from '@/domains/project/services/ProjectService'
import { useProjectStore } from '@/domains/project/stores/project.store'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { toDateString } from '@/lib/toDateString'
import { toDateTimeString } from '@/lib/toDateTimeString'
import type { IProject } from '@/domains/project/types/project.type'
import type { ColumnDef } from '@tanstack/vue-table'

const { t } = useI18n()
const projectStore = useProjectStore()

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

const { data: response, isPending: loading, isError, refetch } = useProjectList(filters)

const projects = computed(() => response.value?.data ?? [])
const total = computed(() => response.value?.meta.total ?? 0)
const error = computed(() => isError.value ? t('project.list.error', 'Failed to load projects') : null)
</script>

<template>
  <AuthenticatedLayout>
    <DataListsWrapper :title="t('project.title')" :loading :error>
      <template #actions>
        <SearchField v-model="filters.search" />
        <Button variant="ghost" @click="refetch()">
          <RefreshCw class="size-4" />
        </Button>

        <div class="h-6 w-px bg-border mx-2" />

        <ButtonLink v-tooltip="t('project.add.description')" variant="default" to="/projects/add">
          {{ t('project.add.title') }}
        </ButtonLink>
      </template>
      <DataTable
        v-model:page="filters.page"
        v-model:page-size="filters.perPage"
        :columns="columns"
        :data="projects"
        :total="total"
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
            <DeleteProjectButton :id="data.id" />
          </div>
        </template>
        <template #actions-header>
          <div class="w-full text-right">
            {{ t('common.actions') }}
          </div>
        </template>
      </DataTable>
    </DataListsWrapper>
  </AuthenticatedLayout>
</template>
