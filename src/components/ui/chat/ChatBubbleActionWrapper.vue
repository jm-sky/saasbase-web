<script setup lang="ts">
import { cn } from '@/lib/utils'

const props = defineProps<{
  variant?: 'sent' | 'received'
  class?: string
}>()
</script>

<template>
  <div
    :class="cn(
      'absolute top-1/2 -translate-y-1/2 flex opacity-0 group-hover:opacity-100 transition-opacity duration-200',
      props.variant === 'sent'
        ? '-left-1 -translate-x-full flex-row-reverse'
        : '-right-1 translate-x-full',
      props.class,
    )"
  >
    <slot />
  </div>
</template>
