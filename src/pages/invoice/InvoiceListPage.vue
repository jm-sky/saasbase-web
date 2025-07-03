<script setup lang="ts">
import { RefreshCw } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import ButtonLink from '@/components/ButtonLink.vue'
import DataListsWrapper from '@/components/DataLists/DataListsWrapper.vue'
import DataTable from '@/components/DataLists/DataTable.vue'
import SearchField from '@/components/DataLists/Filters/SearchField.vue'
import { Button } from '@/components/ui/button'
import InvoiceStatusBadge from '@/domains/financial/components/InvoiceStatusBadge.vue'
import DeleteInvoiceButton from '@/domains/invoice/components/DeleteInvoiceButton.vue'
import EditInvoiceButton from '@/domains/invoice/components/EditInvoiceButton.vue'
import InvoiceListDropdown from '@/domains/invoice/components/InvoiceListDropdown.vue'
import { type IInvoiceFilters, invoiceService } from '@/domains/invoice/services/invoiceService'
import { useInvoiceStore } from '@/domains/invoice/stores/invoice.store'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { money } from '@/lib/money'
import { toDateTimeString } from '@/lib/toDateTimeString'
import type { ColumnDef } from '@tanstack/vue-table'
import type { IInvoice } from '@/domains/invoice/types/invoice.type'
import type { IResourceMeta } from '@/domains/shared/types/resource.type'

const { t, locale } = useI18n()

const invoiceStore = useInvoiceStore()
const { invoices } = storeToRefs(invoiceStore)

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
    id: 'buyer',
    accessorKey: 'buyer.name',
    header: t('financial.fields.buyer'),
    enableMultiSort: true,
  },
  {
    accessorKey: 'issueDate',
    header: t('financial.fields.issueDate'),
    size: 100,
  },
  {
    accessorKey: 'number',
    header: t('financial.fields.number', 'Number'),
  },
  {
    accessorKey: 'status',
    header: t('financial.fields.status', 'Status'),
  },
  {
    accessorKey: 'totalGross',
    header: t('financial.fields.total'),
  },
  {
    accessorKey: 'createdAt',
    header: t('financial.fields.createdAt', 'Created At'),
    cell: (info: { row: { original: IInvoice } }) => info.row.original.createdAt ? toDateTimeString(info.row.original.createdAt) : '-',
  },
  {
    id: 'actions',
    header: t('common.actions'),
    enableColumnFilter: false,
    enableSorting: false,
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
        <Button variant="ghost" @click="refresh">
          <RefreshCw class="size-4" />
        </Button>

        <div class="h-6 w-px bg-border mx-2" />

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
        <template #buyer="{ data }">
          <RouterLink :to="`/invoices/${data.id}/show`" class="text-sm font-medium p-1 text-primary hover:underline">
            {{ data.buyer.name }}
          </RouterLink>
          <div class="text-xs text-muted-foreground p-1">
            {{ data.buyer.taxId }}
          </div>
        </template>

        <template #number="{ data }">
          <ButtonLink :to="`/invoices/${data.id}/show`" class="flex-col items-start">
            {{ data.number ? data.number : t('invoice.number.empty', 'No number') }}
            <div class="text-xs text-muted-foreground">
              {{ t(`financial.invoiceType.${data.type}`, data.type) }}
            </div>
          </ButtonLink>
        </template>

        <template #status="{ data }">
          <InvoiceStatusBadge :status="data.status" />
        </template>

        <template #totalGross="{ data }">
          <div class="grid grid-cols-2 gap-1">
            <div class="font-semibold">
              {{ t('financial.fields.totalGross', 'Total Gross') }}
            </div>
            <div class="font-semibold">
              {{ money(data.totalGross, data.currency, locale) }}
            </div>
            <div>
              {{ t('financial.fields.totalNet', 'Total Net') }}
            </div>
            <div>
              {{ money(data.totalNet, data.currency, locale) }}
            </div>
          </div>
        </template>

        <template #actions="{ data }">
          <div class="flex gap-2 justify-end w-full whitespace-nowrap min-w-0">
            <EditInvoiceButton :invoice="data" />
            <DeleteInvoiceButton :id="data.id" @deleted="refresh" />
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
