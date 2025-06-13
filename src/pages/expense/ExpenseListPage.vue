<script setup lang="ts">
import { RefreshCw, Upload } from 'lucide-vue-next'
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import ButtonLink from '@/components/ButtonLink.vue'
import DataListsWrapper from '@/components/DataLists/DataListsWrapper.vue'
import DataTable from '@/components/DataLists/DataTable.vue'
import SearchField from '@/components/DataLists/Filters/SearchField.vue'
import FileDropZoneSlot from '@/components/Inputs/FileDropZoneSlot.vue'
import { Button } from '@/components/ui/button'
import ExpenseListDropdown from '@/domains/expense/components/ExpenseListDropdown.vue'
import UploadForOcrModal from '@/domains/expense/components/UploadForOcrModal.vue'
import { expenseService, type IExpenseFilters } from '@/domains/expense/services/expenseService'
import InvoiceStatusBadge from '@/domains/financial/components/InvoiceStatusBadge.vue'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { toDateTimeString } from '@/lib/toDateTimeString'
import type { ColumnDef } from '@tanstack/vue-table'
import type { IExpense } from '@/domains/expense/types/expense.type'
import type { IResourceMeta } from '@/domains/shared/types/resource.type'

const { t } = useI18n()

const expenses = ref<IExpense[]>([])
const meta = ref<IResourceMeta>({
  currentPage: 1,
  lastPage: 1,
  perPage: 10,
  total: 0,
})

const loading = ref(false)
const isUploadModalOpen = ref(false)
const draggedFiles = ref<File[]>([])
const error = ref<string | null>(null)
const filters = ref<IExpenseFilters>({
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

const columns: ColumnDef<IExpense>[] = [
  {
    accessorKey: 'number',
    header: t('expense.fields.number', 'Number'),
  },
  {
    accessorKey: 'type',
    header: t('expense.fields.type', 'Type'),
  },
  {
    accessorKey: 'status',
    header: t('expense.fields.status', 'Status'),
  },
  {
    accessorKey: 'totalGross',
    header: t('expense.fields.totalGross', 'Total Gross'),
    cell: (info: { row: { original: IExpense } }) => `${info.row.original.totalGross.toFixed(2)} ${info.row.original.currency}`,
  },
  {
    accessorKey: 'createdAt',
    header: t('expense.fields.createdAt', 'Created At'),
    cell: (info: { row: { original: IExpense } }) => info.row.original.createdAt ? toDateTimeString(info.row.original.createdAt) : '-',
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
    const response = await expenseService.index(filters.value)
    expenses.value = response.data
    meta.value = response.meta
  } catch (err) {
    error.value = 'Failed to load expenses'
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
    <DataListsWrapper :title="t('expense.title', 'Expenses')" :loading :error>
      <template #actions>
        <SearchField v-model="filters.search" />
        <Button variant="outline" @click="refresh">
          <RefreshCw class="size-4" />
        </Button>

        <ButtonLink v-tooltip="t('expense.add.description', 'Add a new expense')" variant="default" to="/expenses/add">
          {{ t('expense.add.title', 'Add Expense') }}
        </ButtonLink>

        <Button variant="outline" @click="isUploadModalOpen = true">
          <Upload class="size-4" />
        </Button>

        <ExpenseListDropdown :filters />
      </template>

      <FileDropZoneSlot v-model:is-active="isUploadModalOpen" v-model:dragged-files="draggedFiles">
        <DataTable
          v-model:page="filters.page"
          v-model:page-size="filters.perPage"
          v-model:column-filters="filters.filter"
          v-model:sorting="filters.sort"
          :columns="columns"
          :data="expenses"
          :total="meta.total"
          :page-size-options="[10, 20, 30, 40, 50]"
          :show-column-filters="true"
          :loading
        >
          <template #number="{ data }">
            <ButtonLink :to="`/expenses/${data.id}/show`">
              {{ data.number ? data.number : t('expense.number.empty', 'No number') }}
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
              <ButtonLink :to="`/expenses/${data.id}/edit`" variant="outline">
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
      </FileDropZoneSlot>
    </DataListsWrapper>

    <UploadForOcrModal v-model:is-open="isUploadModalOpen" v-model:dragged-files="draggedFiles" @uploaded="refresh" />
  </AuthenticatedLayout>
</template>
