<script setup lang="ts">
import { Icon } from '@iconify/vue'
import Button from '@/components/ui/button/Button.vue'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import type { ButtonVariants } from '../ui/button'
import LayoutColorSection from './LayoutColorSection.vue'
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  variant?: ButtonVariants['variant']
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button
        size="icon"
        :variant="props.variant ?? 'ghost'"
        :class="props.class"
      >
        <Icon icon="lucide:paintbrush" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-96 space-y-3">
      <LayoutColorSection />
    </PopoverContent>
  </Popover>
</template>
