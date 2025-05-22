<script setup lang="ts" generic="TData, TValue">
import {
  FlexRender,
  getCoreRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import { computed, ref } from 'vue'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { valueUpdater } from '@/lib/utils'
import ColumnFilter from './DataLists/Filters/ColumnFilter.vue'
import TablePagination from './ui/table/TablePagination.vue'
import type { ColumnDef, VisibilityState } from '@tanstack/vue-table'
import type { FilterDefinition } from '@/domains/shared/types/resource.type'

const page = defineModel<number>('page', { default: 1 })
const pageSize = defineModel<number>('pageSize', { default: 10 })

const props = defineProps<{
  columns: ColumnDef<TData>[]
  data: TData[]
  initialColumnVisibility?: VisibilityState
  total?: number
  pageSizeOptions?: number[]
  showColumnFilters?: boolean
}>()

const columnFilters = defineModel<Record<string, FilterDefinition>>('column-filters', { default: {} })

const columnVisibility = ref<VisibilityState>({ ...props.initialColumnVisibility })

const table = useVueTable({
  get data() { return props.data },
  get columns() { return props.columns },
  getCoreRowModel: getCoreRowModel(),
  onColumnVisibilityChange: updaterOrValue => { valueUpdater(updaterOrValue, columnVisibility) },
  state: {
    get columnVisibility() { return columnVisibility.value },
  }
})

const total = computed(() => props.total ?? 0)
const pageSizeOptions = computed(() => props.pageSizeOptions ?? [10, 20, 30, 40, 50])
const pageCount = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))
</script>

<template>
  <div class="border rounded-md shadow-xs">
    <Table>
      <TableHeader>
        <TableRow
          v-for="headerGroup in table.getHeaderGroups()"
          :key="headerGroup.id"
        >
          <TableHead
            v-for="header in headerGroup.headers"
            :key="header.id"
          >
            <FlexRender
              v-if="!header.isPlaceholder"
              :render="header.column.columnDef.header"
              :props="header.getContext()"
            />
          </TableHead>
        </TableRow>
        <template v-if="props.showColumnFilters">
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead v-for="header in headerGroup.headers" :key="header.id" class="bg-gray-50">
              <slot :name="`${header.id}-filter`" :header="header">
                <ColumnFilter v-model="columnFilters[header.id]" />
              </slot>
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
          >
            <TableCell
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
            >
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
            </TableCell>
          </TableRow>
        </template>
        <template v-else>
          <TableRow>
            <TableCell
              :colspan="columns.length"
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
