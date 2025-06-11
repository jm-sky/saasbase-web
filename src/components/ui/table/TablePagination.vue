
<script setup lang="ts">

const props = defineProps<{
  total: number
  pageCount: number
  pageSizeOptions: number[]
}>()

const page = defineModel<number>('page', { required: true })
const pageSize = defineModel<number>('pageSize', { required: true })

const goToPage = (idx: number) => {
  if (idx < 1) idx = 1
  if (idx > props.pageCount) idx = props.pageCount
  page.value = idx
}
</script>

<template>
  <div v-if="total > 0" class="flex items-center flex-wrap gap-2 justify-between px-2 py-2 border-t bg-gray-50 dark:bg-gray-900 rounded-b-md">
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

    <div class="flex items-center space-x-2 mx-auto md:mx-0">
      <button
        class="size-8 p-0 border rounded disabled:opacity-50"
        :disabled="page <= 1"
        @click="goToPage(1)"
      >
        &#171;
      </button>
      <button
        class="size-8 p-0 border rounded disabled:opacity-50"
        :disabled="page <= 1"
        @click="goToPage(page - 1)"
      >
        &#8249;
      </button>
      <button
        class="size-8 p-0 border rounded disabled:opacity-50"
        :disabled="page >= pageCount"
        @click="goToPage(page + 1)"
      >
        &#8250;
      </button>
      <button
        class="size-8 p-0 border rounded disabled:opacity-50"
        :disabled="page >= pageCount"
        @click="goToPage(pageCount)"
      >
        &#187;
      </button>
    </div>
  </div>
</template>
