<script setup lang="ts">
import { RefreshCw } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ButtonLink from '@/components/ButtonLink.vue'
import DataListsWrapper from '@/components/DataLists/DataListsWrapper.vue'
import DataTable from '@/components/DataLists/DataTable.vue'
import SearchField from '@/components/DataLists/Filters/SearchField.vue'
import { Button } from '@/components/ui/button'
import DeleteProductButton from '@/domains/product/components/DeleteProductButton.vue'
import EditProductButton from '@/domains/product/components/EditProductButton.vue'
import ProductListDropdown from '@/domains/product/components/ProductListDropdown.vue'
import { useProductList } from '@/domains/product/composables/useProductQueries'
import { type IProductFilters } from '@/domains/product/services/ProductService'
import { useProductStore } from '@/domains/product/stores/product.store'
import TagList from '@/domains/tags/components/TagList.vue'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { toDateTimeString } from '@/lib/toDateTimeString'
import type { IProduct } from '@/domains/product/types/product.type'
import type { ColumnDef } from '@tanstack/vue-table'

const { t } = useI18n()
const productStore = useProductStore()

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
    cell: (info: { row: { original: IProduct } }) => info.row.original.priceNet?.toFixed(2) ?? '-',
  },
  {
    accessorKey: 'tags',
    header: t('common.tags'),
  },
  {
    accessorKey: 'createdAt',
    header: t('product.fields.createdAt'),
    cell: (info: { row: { original: IProduct } }) => toDateTimeString(info.row.original.createdAt),
  },
  {
    id: 'actions',
    header: t('common.actions'),
  },
]

const { data: response, isPending: loading, isError, refetch } = useProductList(filters)

const products = computed(() => response.value?.data ?? [])
const total = computed(() => response.value?.meta.total ?? 0)
const error = computed(() => isError.value ? t('product.list.error', 'Failed to load products') : null)
</script>

<template>
  <AuthenticatedLayout>
    <DataListsWrapper :title="t('product.title')" :loading :error>
      <template #actions>
        <SearchField v-model="filters.search" />
        <Button variant="ghost" @click="refetch()">
          <RefreshCw class="size-4" />
        </Button>

        <div class="h-6 w-px bg-border mx-2" />

        <ButtonLink v-tooltip="t('product.add.description')" variant="default" to="/products/add">
          {{ t('product.add.title') }}
        </ButtonLink>
        <ProductListDropdown :filters />
      </template>

      <DataTable
        v-model:page="filters.page"
        v-model:page-size="filters.perPage"
        :columns="columns"
        :data="products"
        :total="total"
        :page-size-options="[10, 20, 30, 40, 50]"
        :loading
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
        <template #tags="{ data }">
          <TagList :tags="data.tags" />
        </template>
        <template #actions="{ data }">
          <div class="flex gap-2 justify-end w-full whitespace-nowrap min-w-0">
            <EditProductButton :id="data.id" @click="productStore.setProduct(data)" />
            <DeleteProductButton :id="data.id" />
          </div>
        </template>
        <template #actions-header>
          <div class="w-full text-right">
            {{ t('common.actions') }}
          </div>
        </template>
      </DataTable>
    </DataListsWrapper>
  </AuthenticatedLayout>
</template>
