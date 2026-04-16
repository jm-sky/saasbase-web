<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import EntityDetailsLayout from '@/components/layouts/EntityDetailsLayout.vue'
import TabLink from '@/components/ui/tabs/TabLink.vue'
import ProductSidebar from '@/domains/product/components/ProductSidebar.vue'
import { productService } from '@/domains/product/services/ProductService'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import type { IProduct } from '@/domains/product/types/product.type'

const { t } = useI18n()
const route = useRoute()
const productId = route.params.id as string

const product = ref<IProduct>()
const loading = ref(false)
const error = ref<string | null>(null)

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

const refresh = async () => {
  try {
    loading.value = true
    error.value = null
    product.value = await productService.get(productId)
  } catch (err) {
    handleErrorWithToast(t('product.show.error'), err)
    error.value = 'Failed to load product'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await refresh()
})
</script>

<template>
  <AuthenticatedLayout>
    <EntityDetailsLayout
      v-if="product"
      :title="t('product.productDetails')"
      :back-link="'/products'"
      :edit-link="`/products/${productId}/edit`"
      :name="product.name"
      :logo="product.logoUrl"
      :loading
      show-sidebar
      @refresh="refresh"
    >
      <template #back-link-text>
        {{ t('product.title') }}
      </template>

      <template #sidebar>
        <ProductSidebar :product-id="productId" :product />
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
        <RouterView v-if="product" :product />
      </template>
    </EntityDetailsLayout>
  </AuthenticatedLayout>
</template>
