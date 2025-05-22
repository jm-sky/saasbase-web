<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import TagList from '@/components/DataLists/TagList.vue'
import AvatarUploader from '@/components/Inputs/AvatarUploader.vue'
import EntityDetailsLayout from '@/components/layouts/EntityDetailsLayout.vue'
import InfoSection from '@/components/Sections/InfoSection.vue'
import Separator from '@/components/ui/separator/Separator.vue'
import { productLogoService } from '@/domains/product/services/ProductLogoService'
import { productService } from '@/domains/product/services/ProductService'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { toDateTimeString } from '@/lib/toDateTimeString'
import type { IProduct } from '@/domains/product/models/product.model'

const { t } = useI18n()
const route = useRoute()
const productId = route.params.id as string

const product = ref<IProduct>()
const loading = ref(false)
const error = ref<string | null>(null)

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
      @refresh="refresh"
    >
      <template #back-link-text>
        {{ t('product.title') }}
      </template>

      <template #sidebar>
        <AvatarUploader
          :model-id="productId"
          :avatar-url="product.logoUrl"
          :uploader-service="productLogoService"
          auto-upload
          size="lg"
          @uploaded="refresh"
          @removed="refresh"
        />

        <div class="font-bold">
          {{ product.name ?? '...' }}
        </div>

        <Separator class="my-2" />

        <div class="flex flex-col gap-3 text-left">
          <InfoSection :label="t('product.fields.description')" :value="product.description" />
          <InfoSection :label="t('product.fields.unit')" :value="product.unit?.name" />
          <InfoSection :label="t('product.fields.priceNet')" :value="product.priceNet?.toString()" />
          <InfoSection :label="t('product.fields.vatRate')" :value="product.vatRate?.name" />
          <InfoSection :label="t('product.fields.tags')">
            <TagList :tags="product.tags" />
          </InfoSection>
          <InfoSection :label="t('product.fields.createdAt')" :value="toDateTimeString(product.createdAt)" />
          <InfoSection :label="t('product.fields.updatedAt')" :value="toDateTimeString(product.updatedAt)" />
        </div>
      </template>

      <template #tabs>
        <RouterLink
          :to="`/products/${productId}/show/overview`"
          class="border-b-2 border-transparent hover:border-muted-foreground px-2 py-1"
          exact-active-class="text-primary border-primary!"
        >
          Overview
        </RouterLink>
        <RouterLink
          :to="`/products/${productId}/show/comments`"
          class="border-b-2 border-transparent hover:border-muted-foreground px-2 py-1"
          exact-active-class="text-primary border-primary!"
        >
          Comments
        </RouterLink>
        <RouterLink
          :to="`/products/${productId}/show/logs`"
          class="border-b-2 border-transparent hover:border-muted-foreground px-2 py-1"
          exact-active-class="text-primary border-primary!"
        >
          Logs
        </RouterLink>
      </template>

      <template #content>
        <RouterView v-if="product" :product />
      </template>
    </EntityDetailsLayout>
  </AuthenticatedLayout>
</template>
