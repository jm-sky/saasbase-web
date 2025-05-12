<script setup lang="ts">
import { defineProps, withDefaults } from 'vue'
import { Textarea } from '@/components/ui/textarea'
import type { HTMLAttributes } from 'vue'

const props = withDefaults(defineProps<{
  class?: HTMLAttributes['class']
  modelValue?: string | number
  placeholder?: string
  disabled?: boolean
  rows?: number
  autofocus?: boolean
  name?: string
}>(), {
  name: 'message',
})
</script>

<template>
  <Textarea
    v-bind="props"
    :class="['max-h-12 px-4 py-3 bg-background text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 w-full rounded-md flex items-center h-16 resize-none', props.class]"
    autocomplete="off"
  />
</template>
