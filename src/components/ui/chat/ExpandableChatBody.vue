<script setup lang="ts">
import { useAttrs } from 'vue'
import { cn } from '@/lib/utils'

defineProps<{ class?: string }>()
const attrs = useAttrs()
</script>

<template>
  <div
    :class="cn('flex-grow overflow-y-auto', $props.class)"
    v-bind="attrs"
  >
    <slot />
  </div>
</template>
