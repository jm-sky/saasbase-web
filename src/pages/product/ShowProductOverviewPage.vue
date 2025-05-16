<script setup lang="ts">
import ProductAttachmentsList from '@/domains/product/components/attachments/ProductAttachmentsList.vue'
import type { IProduct } from '@/domains/product/models/product.model'

defineProps<{
  product?: IProduct
}>()
</script>

<template>
  <div class="flex flex-col gap-2 border rounded-md p-4 shadow-lg/5">
    <div class="font-bold">
      Description
    </div>
    <div class="text-muted-foreground">
      {{ product?.description }}
    </div>
  </div>

  <div class="border rounded-md p-2 shadow-lg/5">
    <ProductAttachmentsList />
  </div>
</template>
