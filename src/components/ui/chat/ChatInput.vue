<script setup lang="ts">
import { Textarea } from '@/components/ui/textarea'
import type { HTMLAttributes } from 'vue'

const props = withDefaults(defineProps<{
  class?: HTMLAttributes['class']
  placeholder?: string
  disabled?: boolean
  rows?: number
  autofocus?: boolean
  name?: string
}>(), {
  name: 'message',
})

const modelValue = defineModel<string | number>({ required: true })
</script>

<template>
  <Textarea
    v-model="modelValue"
    v-bind="props"
    :class="['max-h-12 px-4 py-3 bg-background text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 w-full rounded-md flex items-center h-16 resize-none', props.class]"
    autocomplete="off"
  />
</template>
