<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { toDateTimeString } from '@/lib/toDateTimeString'
import type { IProduct } from '@/domains/product/models/product.model'

const { t } = useI18n()

const { product } = defineProps<{
  product: IProduct
}>()
</script>

<template>
  <div class="flex flex-col gap-2 border rounded-md p-4 shadow-lg/5">
    <div class="font-bold">
      Logs
    </div>

    <div class="flex flex-col gap-2 border rounded-md p-4">
      <div class="font-semibold">
        {{ t('common.createdAt') }}
      </div>
      <div>
        {{ toDateTimeString(product.createdAt) }}
      </div>
    </div>
  </div>
</template>
