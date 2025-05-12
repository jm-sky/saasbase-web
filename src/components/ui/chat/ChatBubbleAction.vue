<script setup lang="ts">
import { defineProps } from 'vue'
import Button from '@/components/ui/button/Button.vue'
import type { ButtonVariants } from '@/components/ui/button'

const props = defineProps<{
  icon?: object
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  class?: string
  onClick?: (e: MouseEvent) => void
}>()
</script>

<template>
  <Button
    :variant="props.variant ?? 'ghost'"
    :size="props.size ?? 'icon'"
    :class="props.class"
    @click="props.onClick"
  >
    <template v-if="props.icon">
      <component :is="props.icon" />
    </template>
    <slot v-else />
  </Button>
</template>
