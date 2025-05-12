<script setup lang="ts">
import { useAttrs } from 'vue'
import { cn } from '@/lib/utils'

defineProps<{ class?: string }>()
const attrs = useAttrs()
</script>

<template>
  <div
    :class="cn('flex items-center justify-between p-4 border-b', $props.class)"
    v-bind="attrs"
  >
    <slot />
  </div>
</template>
