<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { cn } from '@/lib/utils'
import { inputVariants } from './index'
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  variant?: 'default' | 'filled'

  defaultValue?: string | number
  modelValue?: string | number
  class?: HTMLAttributes['class']
}>()

const emits = defineEmits<(e: 'update:modelValue', payload: string | number) => void>()

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
})
</script>

<template>
  <input
    v-model="modelValue"
    data-slot="input"
    :class="cn(inputVariants({ variant }), props.class)"
  >
</template>
