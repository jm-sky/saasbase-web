<script setup lang="ts">
import { formatDate, parseISO } from 'date-fns'
import { computed } from 'vue'
import MessageLoading from '@/components/ui/chat/MessageLoading.vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  variant?: 'received' | 'sent'
  layout?: 'default' | 'ai'
  isLoading?: boolean
  class?: string
  createdAt?: string
}>()

const messageClass = computed(() => {
  let base = 'p-4'
  if (props.variant === 'received') base += ' bg-secondary text-secondary-foreground rounded-r-lg rounded-tl-lg'
  if (props.variant === 'sent') base += ' bg-primary text-primary-foreground rounded-l-lg rounded-tr-lg'
  if (props.layout === 'ai') base += ' border-t w-full rounded-none bg-transparent'
  return cn(base, 'break-words max-w-full whitespace-pre-wrap', props.class)
})
</script>

<template>
  <div :class="messageClass">
    <template v-if="props.isLoading">
      <MessageLoading />
    </template>
    <template v-else>
      <slot />
    </template>
    <div v-if="props.createdAt" class="text-xs opacity-50 pt-1 text-end">
      {{ formatDate(parseISO(props.createdAt), 'dd.MM.yyyy, HH:mm:ss') }}
    </div>
  </div>
</template>
