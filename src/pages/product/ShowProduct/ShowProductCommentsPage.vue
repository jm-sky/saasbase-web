<script setup lang="ts">
import ProductCommentsList from '@/domains/product/components/comments/ProductCommentsList.vue'
import type { IProduct } from '@/domains/product/types/product.type'

const { product } = defineProps<{
  product: IProduct
}>()
</script>

<template>
  <div class="flex flex-col gap-2 border rounded-md p-4 shadow-lg/5">
    <ProductCommentsList :product />
  </div>
</template>
