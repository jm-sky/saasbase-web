<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import ButtonLink from '@/components/ButtonLink.vue'
import { productService } from '@/domains/product/services/productService'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
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
    handleErrorWithToast(t('product.show.error', 'Error'), err)
    error.value = t('product.show.error', 'Failed to load product')
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
    <div class="p-6 flex flex-col gap-y-4">
      <div class="border px-4 py-2 rounded-md">
        <div class="flex justify-between items-center">
          <div class="font-semibold">
            {{ product?.name ?? '...' }}
          </div>
          <div class="flex gap-2">
            <ButtonLink variant="default" :to="`/products/${productId}/edit`">
              {{ t('common.edit', 'Edit') }}
            </ButtonLink>
          </div>
        </div>
      </div>
      <div class="border px-4 py-2 rounded-md grid grid-cols-2 gap-x-8 gap-y-2">
        <div class="flex flex-col gap-2">
          <div class="font-semibold">
            {{ t('product.name') }}
          </div>
          <div>{{ product?.name }}</div>
          <div class="font-semibold">
            {{ t('product.description') }}
          </div>
          <div>{{ product?.description ?? '-' }}</div>
        </div>
        <div class="flex flex-col gap-2">
          <div class="font-semibold">
            {{ t('product.price') }}
          </div>
          <div>{{ product?.priceNet }}</div>
        </div>
      </div>
    </div>
  </AuthenticatedLayout>
</template>
