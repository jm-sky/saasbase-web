<script setup lang="ts">
import { RefreshCw } from 'lucide-vue-next'
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import ButtonLink from '@/components/ButtonLink.vue'
import DataListsWrapper from '@/components/DataLists/DataListsWrapper.vue'
import DataTable from '@/components/DataLists/DataTable.vue'
import SearchField from '@/components/DataLists/Filters/SearchField.vue'
import { Button } from '@/components/ui/button'
import InvoiceStatusBadge from '@/domains/financial/components/InvoiceStatusBadge.vue'
import InvoiceListDropdown from '@/domains/invoice/components/InvoiceListDropdown.vue'
import { type IInvoiceFilters, invoiceService } from '@/domains/invoice/services/invoiceService'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { toDateTimeString } from '@/lib/toDateTimeString'
import type { ColumnDef } from '@tanstack/vue-table'
import type { IInvoice } from '@/domains/invoice/types/invoice.type'
import type { IResourceMeta } from '@/domains/shared/types/resource.type'

const { t } = useI18n()

const invoices = ref<IInvoice[]>([])
const meta = ref<IResourceMeta>({
  currentPage: 1,
  lastPage: 1,
  perPage: 10,
  total: 0,
})
const loading = ref(false)
const error = ref<string | null>(null)
const filters = ref<IInvoiceFilters>({
  search: '',
  page: 1,
  perPage: 10,
  filter: {
    number: { value: '', operator: 'eq' },
    type: { value: '', operator: 'eq' },
    status: { value: '', operator: 'eq' },
    createdAt: { value: '', operator: 'eq' },
  },
  sort: [],
})

const columns: ColumnDef<IInvoice>[] = [
  {
    accessorKey: 'number',
    header: t('invoice.fields.number', 'Number'),
  },
  {
    accessorKey: 'type',
    header: t('invoice.fields.type', 'Type'),
  },
  {
    accessorKey: 'status',
    header: t('invoice.fields.status', 'Status'),
  },
  {
    accessorKey: 'totalGross',
    header: t('invoice.fields.totalGross', 'Total Gross'),
    cell: (info: { row: { original: IInvoice } }) => `${info.row.original.totalGross.toFixed(2)} ${info.row.original.currency}`,
  },
  {
    accessorKey: 'createdAt',
    header: t('invoice.fields.createdAt', 'Created At'),
    cell: (info: { row: { original: IInvoice } }) => info.row.original.createdAt ? toDateTimeString(info.row.original.createdAt) : '-',
  },
  {
    id: 'actions',
    header: t('common.actions'),
    enableColumnFilter: false,
    meta: {
      clearFilters: true,
    },
  },
]

const refresh = async () => {
  try {
    loading.value = true
    error.value = null
    // For now, ignore filters except pagination
    const response = await invoiceService.index(filters.value)
    invoices.value = response.data
    meta.value = response.meta
  } catch (err) {
    error.value = 'Failed to load invoices'
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
    <DataListsWrapper :title="t('invoice.title', 'Invoices')" :loading :error>
      <template #actions>
        <SearchField v-model="filters.search" />
        <Button variant="outline" @click="refresh">
          <RefreshCw class="size-4" />
        </Button>
        <ButtonLink v-tooltip="t('invoice.add.description', 'Add a new invoice')" variant="default" to="/invoices/add">
          {{ t('invoice.add.title', 'Add Invoice') }}
        </ButtonLink>
        <InvoiceListDropdown :filters />
      </template>

      <DataTable
        v-model:page="filters.page"
        v-model:page-size="filters.perPage"
        v-model:column-filters="filters.filter"
        v-model:sorting="filters.sort"
        :columns="columns"
        :data="invoices"
        :total="meta.total"
        :page-size-options="[10, 20, 30, 40, 50]"
        :show-column-filters="true"
        :loading
      >
        <template #number="{ data }">
          <ButtonLink :to="`/invoices/${data.id}/show`">
            {{ data.number }}
          </ButtonLink>
        </template>
        <template #type="{ data }">
          {{ t(`financial.invoiceType.${data.type}`, data.type) }}
        </template>
        <template #status="{ data }">
          <InvoiceStatusBadge :status="data.status" />
        </template>
        <template #totalGross="{ data }">
          {{ data.totalGross?.toFixed(2) ?? '-' }} {{ data.currency }}
        </template>
        <template #actions="{ data }">
          <div class="flex gap-2 justify-end w-full whitespace-nowrap min-w-0">
            <ButtonLink :to="`/invoices/${data.id}/edit`" variant="outline">
              {{ t('common.edit', 'Edit') }}
            </ButtonLink>
            <!-- Add delete button if needed -->
          </div>
        </template>
        <template #actions-header>
          <div class="w-full text-right">
            {{ t('actions', 'Actions') }}
          </div>
        </template>
      </DataTable>
    </DataListsWrapper>
  </AuthenticatedLayout>
</template>
