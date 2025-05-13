<script setup lang="ts">
import { ArrowDown } from 'lucide-vue-next'
import Button from '@/components/ui/button/Button.vue'
import { cn } from '@/lib/utils'
import useAutoScroll from './useAutoScroll'

const props = defineProps<{
  class?: string
  smooth?: boolean
}>()

const {
  scrollRef,
  isAtBottom,
  scrollToBottom,
  disableAutoScroll,
} = useAutoScroll({ smooth: props.smooth })
</script>

<template>
  <div class="relative w-full h-full">
    <div
      ref="scrollRef"
      :class="cn('flex flex-col w-full h-full p-4 overflow-y-auto', props.class)"
      @wheel="disableAutoScroll"
      @touchmove="disableAutoScroll"
    >
      <div class="flex flex-col gap-6">
        <slot />
      </div>
    </div>
    <Button
      v-if="!isAtBottom"
      size="icon"
      variant="outline"
      class="absolute bottom-2 left-1/2 transform -translate-x-1/2 inline-flex rounded-full shadow-md"
      aria-label="Scroll to bottom"
      @click="scrollToBottom"
    >
      <slot name="arrow-icon">
        <ArrowDown class="size-4" />
      </slot>
    </Button>
  </div>
</template>
