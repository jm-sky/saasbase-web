<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { ToastClose, type ToastCloseProps } from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<ToastCloseProps & {
  class?: HTMLAttributes['class']
}>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props // eslint-disable-line @typescript-eslint/no-unused-vars

  return delegated
})
</script>

<template>
  <ToastClose
    v-bind="delegatedProps"
    :class="cn('absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-hidden focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 hover:group-[.destructive]:text-red-50 focus:group-[.destructive]:ring-red-400 focus:group-[.destructive]:ring-offset-red-600', props.class)"
  >
    <X class="size-4" />
  </ToastClose>
</template>
