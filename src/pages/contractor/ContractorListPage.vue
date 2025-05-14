<script setup lang="ts">
import { RefreshCw } from 'lucide-vue-next'
import { onMounted, ref, type Ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import ButtonLink from '@/components/ButtonLink.vue'
import DataListsWrapper from '@/components/DataLists/DataListsWrapper.vue'
import DataTable from '@/components/DataTable.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import DeleteContractorButton from '@/domains/contractor/components/DeleteContractorButton.vue'
import EditContractorButton from '@/domains/contractor/components/EditContractorButton.vue'
import { contractorService, type IContractorFilters } from '@/domains/contractor/services/contractorService'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { toDateString } from '@/lib/toDateString'
import type { ColumnDef } from '@tanstack/vue-table'
import type { IContractor } from '@/domains/contractor/models/contractor.model'
import type { IResourceMeta } from '@/domains/shared/types/resource.type'

const { t } = useI18n()

const contractors: Ref<IContractor[]> = ref([])
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
})

const columnFilters = ref<Record<string, { value: string, operator: string }>>({
  name: { value: '', operator: 'eq' },
  taxId: { value: '', operator: 'eq' },
  type: { value: '', operator: 'eq' },
  createdAt: { value: '', operator: 'eq' },
})

const columns: ColumnDef<IContractor>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'taxId',
    header: 'Tax ID',
  },
  {
    id: 'type',
    header: 'Type',
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: (info: { row: { original: IContractor } }) => toDateString(info.row.original.createdAt),
  },
  {
    id: 'actions',
    header: 'Actions',
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

onMounted(() => {
  void refresh()
})

watch(filters, () => refresh(), { deep: true })
</script>

<template>
  <AuthenticatedLayout>
    <DataListsWrapper :title="t('contractor.title')" :loading :error>
      <template #actions>
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
        v-model:column-filters="columnFilters"
        :columns="columns"
        :data="contractors"
        :total="meta.total"
        :page-size-options="[10, 20, 30, 40, 50]"
        :show-column-filters="true"
      >
        <template #name="{ data }">
          <ButtonLink :to="`/contractors/${data.id}/show/overview`">
            {{ data.name }}
          </ButtonLink>
        </template>
        <template #type="{ data }">
          <div class="flex gap-2">
            <Badge v-if="data.isSupplier" variant="secondary">
              Supplier
            </Badge>
            <Badge v-if="data.isBuyer" variant="secondary">
              Buyer
            </Badge>
          </div>
        </template>
        <template #actions="{ data }">
          <div class="flex gap-2 justify-end w-full whitespace-nowrap min-w-0">
            <EditContractorButton :id="data.id" />
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
