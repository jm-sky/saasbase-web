<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Select from '@/components/ui/select/Select.vue'
import SelectContent from '@/components/ui/select/SelectContent.vue'
import SelectItem from '@/components/ui/select/SelectItem.vue'
import SelectTrigger from '@/components/ui/select/SelectTrigger.vue'
import SelectValue from '@/components/ui/select/SelectValue.vue'
import { cn } from '@/lib/utils'
import type { TProductType } from '../types/product.type'

const { t } = useI18n()

const modelValue = defineModel<TProductType | undefined>('modelValue', { required: true })

const props = defineProps<{
  class?: string
}>()
</script>

<template>
  <Select v-model="modelValue" class="bg-white/50 dark:bg-black/50">
    <SelectTrigger
      aria-label="Select product type"
      :class="cn(
        'flex items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0',
        props.class,
      )"
    >
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="product">
        {{ t('product.type.product') }}
      </SelectItem>
      <SelectItem value="service">
        {{ t('product.type.service') }}
      </SelectItem>
    </SelectContent>
  </Select>
</template>
