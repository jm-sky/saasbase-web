<script setup lang="ts">
import { RefreshCw } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { onMounted, ref, type Ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import ButtonLink from '@/components/ButtonLink.vue'
import DataListsWrapper from '@/components/DataLists/DataListsWrapper.vue'
import SearchField from '@/components/DataLists/Filters/SearchField.vue'
import DataTable from '@/components/DataTable.vue'
import TagList from '@/components/TagList.vue'
import Avatar from '@/components/ui/avatar/Avatar.vue'
import AvatarFallback from '@/components/ui/avatar/AvatarFallback.vue'
import AvatarImage from '@/components/ui/avatar/AvatarImage.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import DeleteContractorButton from '@/domains/contractor/components/actions/DeleteContractorButton.vue'
import EditContractorButton from '@/domains/contractor/components/actions/EditContractorButton.vue'
import { contractorService, type IContractorFilters } from '@/domains/contractor/services/ContractorService'
import { useContractorStore } from '@/domains/contractor/store/contractor.store'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { toDateTimeString } from '@/lib/toDateTimeString'
import type { ColumnDef } from '@tanstack/vue-table'
import type { IContractor } from '@/domains/contractor/types/contractor.type'
import type { IResourceMeta } from '@/domains/shared/types/resource.type'

const { t } = useI18n()
const contractorStore = useContractorStore()
const { contractors } = storeToRefs(contractorStore)

const meta: Ref<IResourceMeta> = ref({
  currentPage: 1,
  lastPage: 1,
  perPage: 10,
  total: 0,
})

const loading = ref(false)
const error = ref<string | null>(null)
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
  },
]

const refresh = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await contractorService.index(filters.value)
    contractors.value = response.data
    meta.value = response.meta
  } catch (err) {
    error.value = 'Failed to load contractors'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const removeRow = (id: string) => {
  contractors.value = contractors.value.filter((contractor) => contractor.id !== id)
  meta.value.total -= 1
}

onMounted(() => {
  void refresh()
})

watch(filters, () => refresh(), { deep: true })
</script>

<template>
  <AuthenticatedLayout>
    <DataListsWrapper :title="t('contractor.title')" :loading :error>
      <template #actions>
        <SearchField v-model="filters.search" />
        <Button variant="outline" @click="refresh">
          <RefreshCw class="h-4 w-4" />
        </Button>
        <ButtonLink v-tooltip="t('contractor.add.description')" variant="default" to="/contractors/add">
          {{ t('contractor.add.title') }}
        </ButtonLink>
      </template>

      <DataTable
        v-model:page="filters.page"
        v-model:page-size="filters.perPage"
        v-model:column-filters="filters.filter"
        v-model:sorting="filters.sort"
        :columns="columns"
        :data="contractors"
        :total="meta.total"
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
            <DeleteContractorButton :id="data.id" @delete="removeRow(data.id)" />
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
