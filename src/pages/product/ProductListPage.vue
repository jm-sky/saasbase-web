<script setup lang="ts">
import { RefreshCw } from 'lucide-vue-next'
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import ButtonLink from '@/components/ButtonLink.vue'
import DataListsWrapper from '@/components/DataLists/DataListsWrapper.vue'
import DataTable from '@/components/DataTable.vue'
import { Button } from '@/components/ui/button'
import DeleteProductButton from '@/domains/product/components/DeleteProductButton.vue'
import EditProductButton from '@/domains/product/components/EditProductButton.vue'
import { type IProductFilters, productService } from '@/domains/product/services/ProductService'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { toDateString } from '@/lib/toDateString'
import type { ColumnDef } from '@tanstack/vue-table'
import type { IProduct } from '@/domains/product/models/product.model'
import type { IResourceMeta } from '@/domains/shared/types/resource.type'

const { t } = useI18n()

const products = ref<IProduct[]>([])
const meta = ref<IResourceMeta>({
  currentPage: 1,
  lastPage: 1,
  perPage: 10,
  total: 0,
})
const loading = ref(false)
const error = ref<string | null>(null)
const filters = ref<IProductFilters>({
  search: '',
  page: 1,
  perPage: 10,
})

const columns: ColumnDef<IProduct>[] = [
  {
    accessorKey: 'name',
    header: t('product.fields.name'),
  },
  {
    accessorKey: 'description',
    header: t('product.fields.description'),
  },
  {
    accessorKey: 'priceNet',
    header: t('product.fields.price'),
    cell: (info: { row: { original: IProduct } }) => info.row.original.priceNet.toFixed(2),
  },
  {
    accessorKey: 'createdAt',
    header: t('product.fields.createdAt'),
    cell: (info: { row: { original: IProduct } }) => toDateString(info.row.original.createdAt),
  },
  {
    id: 'actions',
    header: t('actions'),
  },
]

const refresh = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await productService.index(filters.value)
    products.value = response.data
    meta.value = response.meta
  } catch (err) {
    error.value = 'Failed to load products'
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
    <DataListsWrapper :title="t('product.title')" :loading :error>
      <template #actions>
        <Button variant="outline" @click="refresh">
          <RefreshCw class="h-4 w-4" />
        </Button>
        <ButtonLink v-tooltip="t('product.add.description')" variant="default" to="/products/add">
          {{ t('product.add.title') }}
        </ButtonLink>
      </template>
      <DataTable
        v-model:page="filters.page"
        v-model:page-size="filters.perPage"
        :columns="columns"
        :data="products"
        :total="meta.total"
        :page-size-options="[10, 20, 30, 40, 50]"
      >
        <template #name="{ data }">
          <ButtonLink :to="`/products/${data.id}/show/overview`">
            {{ data.name }}
          </ButtonLink>
        </template>
        <template #description="{ data }">
          <div class="text-ellipsis overflow-hidden whitespace-nowrap max-w-48">
            {{ data.description?.slice(0, 100) ?? '-' }}
          </div>
        </template>
        <template #actions="{ data }">
          <div class="flex gap-2 justify-end w-full whitespace-nowrap min-w-0">
            <EditProductButton :id="data.id" />
            <DeleteProductButton :id="data.id" />
          </div>
        </template>
        <template #actions-header>
          <div class="w-full text-right">
            {{ t('actions') }}
          </div>
        </template>
      </DataTable>
    </DataListsWrapper>
  </AuthenticatedLayout>
</template>
