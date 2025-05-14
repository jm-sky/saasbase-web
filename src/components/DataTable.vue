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
import type { ColumnDef, VisibilityState } from '@tanstack/vue-table'

const page = defineModel<number>('page', { default: 1 })
const pageSize = defineModel<number>('pageSize', { default: 10 })

const props = defineProps<{
  columns: ColumnDef<TData>[]
  data: TData[]
  initialColumnVisibility?: VisibilityState
  total?: number
  pageSizeOptions?: number[]
}>()

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

function goToPage(idx: number) {
  if (idx < 1) idx = 1
  if (idx > pageCount.value) idx = pageCount.value
  page.value = idx
}
</script>

<template>
  <div class="border rounded-md">
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
    <!-- Pagination Controls -->
    <div v-if="total > 0" class="flex items-center justify-between px-2 py-2 border-t bg-gray-50">
      <div class="flex items-center space-x-2">
        <span class="text-sm font-medium">Rows per page</span>
        <select
          class="h-8 w-[70px] border rounded px-2 text-sm"
          :value="pageSize"
          @change="pageSize = Number(($event.target as HTMLSelectElement).value)"
        >
          <option v-for="size in pageSizeOptions" :key="size" :value="size">
            {{ size }}
          </option>
        </select>
      </div>
      <div class="flex w-[100px] items-center justify-center text-sm font-medium">
        Page {{ page }} of {{ pageCount }}
      </div>
      <div class="flex items-center space-x-2">
        <button
          class="w-8 h-8 p-0 border rounded disabled:opacity-50"
          :disabled="page <= 1"
          @click="goToPage(1)"
        >
          &#171;
        </button>
        <button
          class="w-8 h-8 p-0 border rounded disabled:opacity-50"
          :disabled="page <= 1"
          @click="goToPage(page - 1)"
        >
          &#8249;
        </button>
        <button
          class="w-8 h-8 p-0 border rounded disabled:opacity-50"
          :disabled="page >= pageCount"
          @click="goToPage(page + 1)"
        >
          &#8250;
        </button>
        <button
          class="w-8 h-8 p-0 border rounded disabled:opacity-50"
          :disabled="page >= pageCount"
          @click="goToPage(pageCount)"
        >
          &#187;
        </button>
      </div>
    </div>
  </div>
</template>
