<script setup lang="ts">
import { RouterLink, } from 'vue-router'

defineProps<{
  to: string
  label?: string
}>()
</script>

<template>
  <RouterLink
    :to
    :class="[
      'relative border-transparent px-2 py-1',
      `after:content-[''] after:absolute after:translate-x-[-50%] after:bottom-0 after:left-1/2 after:w-0 after:h-0.5 after:bg-muted-foreground after:transition-all after:scale-x-90`,
      'hover:after:w-full',
    ]"
    exact-active-class="text-primary after:bg-primary after:w-full hover:after:scale-x-100"
  >
    <slot>{{ label }}</slot>
  </RouterLink>
</template>
