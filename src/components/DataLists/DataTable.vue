<script setup lang="ts" generic="TData, TValue">
import {
  FlexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import { ArrowDown, ArrowUp } from 'lucide-vue-next'
import { computed, h, ref, watch } from 'vue'
import ColumnFilter from '@/components/DataLists/Filters/ColumnFilter.vue'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import TablePagination from '@/components/ui/table/TablePagination.vue'
import { valueUpdater } from '@/lib/utils'
import type { ColumnDef, Header, Row, RowSelectionState, SortingState, VisibilityState } from '@tanstack/vue-table'
import type { FilterDefinition } from '@/domains/shared/types/resource.type'

const sorting = defineModel<SortingState>('sorting', { default: [] })
const page = defineModel<number>('page', { default: 1 })
const pageSize = defineModel<number>('pageSize', { default: 10 })
const rowSelection = defineModel<RowSelectionState>('rowSelection', { default: {} })
const selectedRows = defineModel<TData[]>('selectedRows', { default: [] })

const props = defineProps<{
  columns: ColumnDef<TData>[]
  data: TData[]
  initialColumnVisibility?: VisibilityState
  total?: number
  pageSizeOptions?: number[]
  showColumnFilters?: boolean
  enableRowSelection?: boolean
  loading?: boolean
}>()

const columnFilters = defineModel<Record<string, FilterDefinition>>('column-filters', { default: {} })

const columnVisibility = ref<VisibilityState>({ ...props.initialColumnVisibility })

// Add selection column if row selection is enabled
const columnsWithSelection = computed(() => {
  if (!props.enableRowSelection) return props.columns

  const selectionColumn: ColumnDef<TData> = {
    id: 'select',
    header: ({ table }) => {
      return h(Checkbox, {
        checked: table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate'),
        'onUpdate:checked': (value: boolean) => { table.toggleAllPageRowsSelected(!!value) },
        ariaLabel: 'Select all',
      })
    },
    cell: ({ row }) => {
      return h(Checkbox, {
        checked: row.getIsSelected(),
        'onUpdate:checked': (value: boolean) => { row.toggleSelected(!!value) },
        ariaLabel: 'Select row',
      })
    },
    enableSorting: false,
    enableHiding: false,
  }

  return [selectionColumn, ...props.columns]
})

const table = useVueTable({
  get data() { return props.data },
  get columns() { return columnsWithSelection.value },
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  onColumnVisibilityChange: updaterOrValue => { valueUpdater(updaterOrValue, columnVisibility) },
  onSortingChange: updaterOrValue => { valueUpdater(updaterOrValue, sorting) },
  onRowSelectionChange: updaterOrValue => { valueUpdater(updaterOrValue, rowSelection) },
  state: {
    get sorting() { return sorting.value },
    get columnVisibility() { return columnVisibility.value },
    get rowSelection() { return rowSelection.value },
  },
  enableRowSelection: props.enableRowSelection || false,
})

const total = computed(() => props.total ?? 0)
const pageSizeOptions = computed(() => props.pageSizeOptions ?? [10, 20, 30, 40, 50])
const pageCount = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))

// Update selectedRows model when table selection changes
watch(() => table.getFilteredSelectedRowModel().rows, (rows: Row<TData>[]) => {
  selectedRows.value = rows.map((row: Row<TData>) => row.original)
}, { deep: true })

// Expose clearSelection method
defineExpose({
  clearSelection: () => {
    table.resetRowSelection()
    selectedRows.value = []
  },
})

const switchSorting = (header: Header<TData, unknown>) => {
  if (header.column.columnDef.enableSorting === false) return

  if (header.column.getIsSorted() === 'desc') {
    header.column.clearSorting()
  } else {
    header.column.toggleSorting(header.column.getIsSorted() === 'asc')
  }
}
</script>

<template>
  <div class="border rounded-md shadow-xs" :class="{ 'opacity-50': loading }">
    <Table>
      <TableHeader>
        <TableRow
          v-for="headerGroup in table.getHeaderGroups()"
          :key="headerGroup.id"
        >
          <TableHead
            v-for="header in headerGroup.headers"
            :key="header.id"
            :class="{ 'cursor-pointer': !header.isPlaceholder && header.column.columnDef.enableSorting !== false }"
            @click="header.id !== 'select' ? switchSorting(header) : undefined"
          >
            <div class="flex items-center gap-2">
              <template v-if="header.id === 'select'">
                <FlexRender
                  :render="header.column.columnDef.header"
                  :props="header.getContext()"
                />
              </template>
              <template v-else-if="!header.isPlaceholder">
                <slot :name="`${header.id}-header`" :header="header">
                  <FlexRender
                    :render="header.column.columnDef.header"
                    :props="header.getContext()"
                  />
                </slot>
                <ArrowDown v-if="header.column.getIsSorted() === 'desc'" class="size-4" />
                <ArrowUp v-if="header.column.getIsSorted() === 'asc'" class="size-4" />
              </template>
            </div>
          </TableHead>
        </TableRow>
        <template v-if="props.showColumnFilters">
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead v-for="header in headerGroup.headers" :key="header.id" class="bg-gray-50 dark:bg-gray-900">
              <template v-if="header.id === 'select'">
                <!-- No filter for selection column -->
              </template>
              <template v-else>
                <slot :name="`${header.id}-filter`" :header="header">
                  <template v-if="header.column.columnDef.enableColumnFilter !== false">
                    <ColumnFilter v-model="columnFilters[header.id]" />
                  </template>
                </slot>
              </template>
            </TableHead>
          </TableRow>
        </template>
      </TableHeader>
      <TableBody>
        <template v-if="table.getRowModel().rows?.length">
          <TableRow
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            :data-state="row.getIsSelected() ? 'selected' : undefined"
            :class="{ 'bg-muted/50': row.getIsSelected() }"
          >
            <TableCell
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
            >
              <template v-if="cell.column.id === 'select'">
                <FlexRender
                  :render="cell.column.columnDef.cell"
                  :props="cell.getContext()"
                />
              </template>
              <template v-else>
                <slot
                  :name="cell.column.id"
                  :column="cell.column"
                  :row="cell.row"
                  :data="cell.row.original"
                >
                  <FlexRender
                    :render="cell.column.columnDef.cell"
                    :props="cell.getContext()"
                  />
                </slot>
              </template>
            </TableCell>
          </TableRow>
        </template>
        <template v-else>
          <TableRow>
            <TableCell
              :colspan="columnsWithSelection.length"
              class="h-24 text-center"
            >
              No results.
            </TableCell>
          </TableRow>
        </template>
      </TableBody>
    </Table>

    <TablePagination
      v-model:page="page"
      v-model:page-size="pageSize"
      :page-size-options="pageSizeOptions"
      :total="total"
      :page-count="pageCount"
    />
  </div>
</template>
