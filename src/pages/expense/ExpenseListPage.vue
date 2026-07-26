<script setup lang="ts">
import { RefreshCw, Upload } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ButtonLink from '@/components/ButtonLink.vue'
import DataListsWrapper from '@/components/DataLists/DataListsWrapper.vue'
import DataTable from '@/components/DataLists/DataTable.vue'
import SearchField from '@/components/DataLists/Filters/SearchField.vue'
import FileDropZoneSlot from '@/components/Inputs/FileDropZoneSlot.vue'
import { Button } from '@/components/ui/button'
import DeleteExpenseButton from '@/domains/expense/components/DeleteExpenseButton.vue'
import EditExpenseButton from '@/domains/expense/components/EditExpenseButton.vue'
import ExpenseListDropdown from '@/domains/expense/components/ExpenseListDropdown.vue'
import UploadForOcrModal from '@/domains/expense/components/UploadForOcrModal.vue'
import { useExpenseList } from '@/domains/expense/composables/useExpenseQueries'
import type { IExpenseFilters } from '@/domains/expense/services/expenseService'
import InvoiceStatusBadge from '@/domains/financial/components/InvoiceStatusBadge.vue'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { money } from '@/lib/money'
import { toDateTimeString } from '@/lib/toDateTimeString'
import type { IExpense } from '@/domains/expense/types/expense.type'
import type { ColumnDef } from '@tanstack/vue-table'

const { t, locale } = useI18n()

const isUploadModalOpen = ref(false)
const draggedFiles = ref<File[]>([])
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
    id: 'seller',
    accessorKey: 'seller.name',
    header: t('financial.fields.seller'),
    enableMultiSort: true,
  },
  {
    accessorKey: 'issueDate',
    header: t('financial.fields.issueDate'),
    size: 100,
  },
  {
    accessorKey: 'number',
    header: t('financial.fields.number'),
  },
  {
    accessorKey: 'status',
    header: t('financial.fields.status'),
  },
  {
    accessorKey: 'totalGross',
    header: t('financial.fields.total'),
  },
  {
    accessorKey: 'createdAt',
    header: t('financial.fields.createdAt', 'Created At'),
    cell: (info: { row: { original: IExpense } }) => info.row.original.createdAt ? toDateTimeString(info.row.original.createdAt) : '-',
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

const { data: response, isPending: loading, isError, refetch } = useExpenseList(filters)

const expenses = computed(() => response.value?.data ?? [])
const total = computed(() => response.value?.meta.total ?? 0)
const error = computed(() => isError.value ? t('expense.list.error', 'Failed to load expenses') : null)
</script>

<template>
  <AuthenticatedLayout>
    <DataListsWrapper :title="t('expense.title', 'Expenses')" :loading :error>
      <template #actions>
        <SearchField v-model="filters.search" />

        <Button variant="ghost" @click="refetch()">
          <RefreshCw class="size-4" />
        </Button>

        <div class="h-6 w-px bg-border mx-2" />

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
          :total="total"
          :page-size-options="[10, 20, 30, 40, 50]"
          :show-column-filters="true"
          :loading
        >
          <template #seller="{ data }">
            <RouterLink :to="`/expenses/${data.id}/show`" class="text-sm font-medium p-1 text-primary hover:underline">
              {{ data.seller.name }}
            </RouterLink>
            <div class="text-xs text-muted-foreground p-1">
              {{ data.seller.taxId }}
            </div>
          </template>

          <template #number="{ data }">
            <ButtonLink :to="`/expenses/${data.id}/show`" class="flex-col items-start">
              {{ data.number ? data.number : t('expense.number.empty', 'No number') }}
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
              <EditExpenseButton :expense="data" />
              <DeleteExpenseButton :id="data.id" />
            </div>
          </template>
          <template #actions-header>
            <div class="w-full text-right">
              {{ t('common.actions', 'Actions') }}
            </div>
          </template>
        </DataTable>
      </FileDropZoneSlot>
    </DataListsWrapper>

    <UploadForOcrModal v-model:is-open="isUploadModalOpen" v-model:dragged-files="draggedFiles" />
  </AuthenticatedLayout>
</template>
