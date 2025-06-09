<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Select from '@/components/ui/select/Select.vue'
import SelectItem from '@/components/ui/select/SelectItem.vue'
import type { TProductType } from '../types/product.type'

const { t } = useI18n()

const modelValue = defineModel<TProductType | undefined>('modelValue', { required: true })
</script>

<template>
  <Select v-model="modelValue" class="bg-white/50 dark:bg-black/50">
    <SelectItem value="product">
      {{ t('product.type.product') }}
    </SelectItem>
    <SelectItem value="service">
      {{ t('product.type.service') }}
    </SelectItem>
  </Select>
</template>