<script setup lang="ts">
import { cn } from '@/lib/utils'

const chatBubbleVariant = (variant: 'received' | 'sent' = 'received', layout: 'default' | 'ai' = 'default', className = '') => {
  let base = 'flex gap-2 max-w-[60%] items-end relative group'
  if (variant === 'received') base += ' self-start'
  if (variant === 'sent') base += ' self-end flex-row-reverse'
  if (layout === 'ai') base += ' max-w-full w-full items-center'
  return cn(base, className)
}

defineProps<{
  variant?: 'received' | 'sent'
  layout?: 'default' | 'ai'
  class?: string
}>()
</script>

<template>
  <div :class="chatBubbleVariant(variant, layout, $props.class)">
    <slot />
  </div>
</template>
