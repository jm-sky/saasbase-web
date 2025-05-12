<script setup lang="ts">
import { useAttrs } from 'vue'
import { cn } from '@/lib/utils'

defineProps<{ class?: string }>()
const attrs = useAttrs()
</script>

<template>
  <div
    :class="cn('border-t p-4', $props.class)"
    v-bind="attrs"
  >
    <slot />
  </div>
</template>
