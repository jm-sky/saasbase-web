<script setup lang="ts">
import { cn } from '@/lib/utils'
import { inputVariants } from './index'
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  variant?: 'default' | 'filled'
  class?: HTMLAttributes['class']
}>()

const modelValue = defineModel<string | number>('modelValue')
</script>

<template>
  <input
    v-model="modelValue"
    data-slot="input"
    :class="cn(inputVariants({ variant }), props.class)"
  >
</template>
