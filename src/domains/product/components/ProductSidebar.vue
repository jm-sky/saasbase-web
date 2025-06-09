<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AvatarUploader from '@/components/Inputs/AvatarUploader.vue'
import InfoSection from '@/components/Sections/InfoSection.vue'
import TagList from '@/components/TagList.vue'
import Separator from '@/components/ui/separator/Separator.vue'
import { config } from '@/config'
import { productLogoService } from '@/domains/product/services/ProductLogoService'
import { money } from '@/lib/money'
import { toDateTimeString } from '@/lib/toDateTimeString'
import type { IProduct } from '@/domains/product/types/product.type'

const { t, locale} = useI18n()

defineProps<{
  productId?: string
  product?: IProduct | null
  disabled?: boolean
}>()

const emit = defineEmits<{
  refresh: []
}>()
</script>

<template>
  <AvatarUploader
    :model-id="productId"
    :avatar-url="product?.logoUrl"
    :uploader-service="productLogoService"
    auto-upload
    size="lg"
    :disabled
    @uploaded="emit('refresh')"
    @removed="emit('refresh')"
  />

  <div class="font-bold">
    {{ product?.name ?? '...' }}
  </div>

  <Separator class="my-2" />

  <div class="flex flex-col gap-3 text-left">
    <InfoSection :label="t('product.fields.description')" :value="product?.description" />
    <InfoSection :label="t('product.fields.unit')" :value="product?.unit?.name" />
    <InfoSection :label="t('product.fields.priceNet')" :value="money(product?.priceNet ?? 0, config.defaults.currency, locale)" />
    <InfoSection :label="t('product.fields.vatRate')" :value="product?.vatRate?.name" />
    <InfoSection :label="t('product.fields.tags')">
      <TagList :tags="product?.tags ?? []" />
    </InfoSection>
    <InfoSection v-if="product" :label="t('product.fields.createdAt')" :value="toDateTimeString(product.createdAt)" />
    <InfoSection v-if="product" :label="t('product.fields.updatedAt')" :value="toDateTimeString(product.updatedAt)" />
  </div>
</template>
