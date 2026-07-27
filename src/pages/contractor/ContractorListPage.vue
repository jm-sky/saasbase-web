<script setup lang="ts">
import { Plus, RefreshCw } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ButtonLink from '@/components/ButtonLink.vue'
import DataListsWrapper from '@/components/DataLists/DataListsWrapper.vue'
import DataTable from '@/components/DataLists/DataTable.vue'
import SearchField from '@/components/DataLists/Filters/SearchField.vue'
import Avatar from '@/components/ui/avatar/Avatar.vue'
import AvatarFallback from '@/components/ui/avatar/AvatarFallback.vue'
import AvatarImage from '@/components/ui/avatar/AvatarImage.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import DeleteContractorButton from '@/domains/contractor/components/actions/DeleteContractorButton.vue'
import EditContractorButton from '@/domains/contractor/components/actions/EditContractorButton.vue'
import { useContractorList } from '@/domains/contractor/composables/useContractorQueries'
import { useContractorStore } from '@/domains/contractor/store/contractor.store'
import TagList from '@/domains/tags/components/TagList.vue'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { toDateTimeString } from '@/lib/toDateTimeString'
import ContractorListDropdown from '../../domains/contractor/components/ContractorListDropdown.vue'
import type { IContractorFilters } from '@/domains/contractor/services/ContractorService'
import type { IContractor } from '@/domains/contractor/types/contractor.type'
import type { ColumnDef } from '@tanstack/vue-table'

const { t } = useI18n()
const contractorStore = useContractorStore()

const filters = ref<IContractorFilters>({
  search: '',
  page: 1,
  perPage: 10,
  filter: {
    name: { value: '', operator: 'eq' },
    vatId: { value: '', operator: 'eq' },
    taxId: { value: '', operator: 'eq' },
    type: { value: '', operator: 'eq' },
    createdAt: { value: '', operator: 'eq' },
  },
  sort: [],
})

const columns: ColumnDef<IContractor>[] = [
  {
    accessorKey: 'name',
    header: t('contractor.fields.name'),
  },
  {
    accessorKey: 'vatId',
    header: t('contractor.fields.vatId'),
  },
  {
    accessorKey: 'roles',
    header: t('contractor.fields.roles'),
  },
  {
    accessorKey: 'createdAt',
    header: t('common.createdAt'),
    cell: (info: { row: { original: IContractor } }) => toDateTimeString(info.row.original.createdAt),
  },
  {
    accessorKey: 'tags',
    header: t('common.tags'),
  },
  {
    id: 'actions',
    header: t('common.actions'),
    enableColumnFilter: false,
  },
]

const { data: response, isLoading: loading, isError, refetch } = useContractorList(filters)

const contractors = computed(() => response.value?.data ?? [])
const total = computed(() => response.value?.meta.total ?? 0)
const error = computed(() => isError.value ? t('contractor.list.error') : null)
</script>

<template>
  <AuthenticatedLayout>
    <DataListsWrapper :title="t('contractor.title')" :loading :error>
      <template #actions>
        <SearchField v-model="filters.search" />
        <Button variant="ghost" @click="refetch()">
          <RefreshCw class="size-4" />
        </Button>

        <div class="h-6 w-px bg-border mx-2" />

        <ButtonLink v-tooltip="t('contractor.add.description')" variant="default" to="/contractors/add">
          <Plus class="size-4 md:hidden" />
          <span class="hidden md:block">
            {{ t('contractor.add.title') }}
          </span>
        </ButtonLink>
        <ContractorListDropdown :filters />
      </template>

      <DataTable
        v-model:page="filters.page"
        v-model:page-size="filters.perPage"
        v-model:column-filters="filters.filter"
        v-model:sorting="filters.sort"
        :columns="columns"
        :data="contractors"
        :total="total"
        :page-size-options="[10, 20, 30, 40, 50]"
        :show-column-filters="true"
        :loading
      >
        <template #name="{ data }">
          <ButtonLink :to="`/contractors/${data.id}/show/overview`" @click="contractorStore.setContractor(data)">
            <Avatar class="size-7">
              <AvatarImage :src="data.logoUrl ?? ''" :alt="data.name" />
              <AvatarFallback>{{ data.name.slice(0, 2) ?? 'X' }}</AvatarFallback>
            </Avatar>
            {{ data.name }}
          </ButtonLink>
        </template>
        <template #roles="{ data }">
          <div class="flex gap-2">
            <Badge v-if="data.isSupplier" variant="secondary">
              Supplier
            </Badge>
            <Badge v-if="data.isBuyer" variant="secondary">
              Buyer
            </Badge>
          </div>
        </template>
        <template #tags="{ data }">
          <TagList :tags="data.tags" />
        </template>
        <template #actions="{ data }">
          <div class="flex gap-2 justify-end w-full whitespace-nowrap min-w-0">
            <EditContractorButton :id="data.id" :contractor="data" />
            <DeleteContractorButton :id="data.id" />
          </div>
        </template>
        <template #actions-header>
          <div class="w-full text-right">
            Actions
          </div>
        </template>
      </DataTable>
    </DataListsWrapper>
  </AuthenticatedLayout>
</template>
