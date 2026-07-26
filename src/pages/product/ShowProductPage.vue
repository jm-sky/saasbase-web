<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import EntityDetailsLayout from '@/components/layouts/EntityDetailsLayout.vue'
import TabLink from '@/components/ui/tabs/TabLink.vue'
import ProductSidebar from '@/domains/product/components/ProductSidebar.vue'
import { useProduct } from '@/domains/product/composables/useProductQueries'
import { useProductStore } from '@/domains/product/stores/product.store'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'

const { t } = useI18n()
const route = useRoute()

const productId = route.params.id as string
const productStore = useProductStore()
const { product: storeProduct } = storeToRefs(productStore)

const { data: product, isPending: loading, refetch } = useProduct(productId)

watch(product, (value) => {
  if (value) productStore.setProduct(value)
}, { immediate: true })

const displayProduct = computed(() => product.value ?? storeProduct.value)

const tabs = computed(() => [
  {
    to: `/products/${productId}/show/overview`,
    label: t('product.overview.title'),
  },
  {
    to: `/products/${productId}/show/comments`,
    label: t('product.comments.title'),
  },
  {
    to: `/products/${productId}/show/logs`,
    label: t('product.logs.title'),
  },
])
</script>

<template>
  <AuthenticatedLayout>
    <EntityDetailsLayout
      :title="t('product.productDetails')"
      :back-link="'/products'"
      :edit-link="`/products/${productId}/edit`"
      :name="displayProduct?.name"
      :logo="displayProduct?.logoUrl"
      :loading
      show-sidebar
      @refresh="refetch()"
    >
      <template #back-link-text>
        {{ t('product.title') }}
      </template>

      <template #sidebar>
        <ProductSidebar :product-id="productId" :product="displayProduct" />
      </template>

      <template #tabs>
        <TabLink
          v-for="tab in tabs"
          :key="tab.to"
          :to="tab.to"
          :label="tab.label"
        />
      </template>

      <template #content>
        <RouterView v-if="displayProduct" :product="displayProduct" />
      </template>
    </EntityDetailsLayout>
  </AuthenticatedLayout>
</template>
