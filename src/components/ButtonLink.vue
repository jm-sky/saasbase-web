<script setup lang="ts">
import { type RouteLocationRaw, RouterLink } from 'vue-router'
import Button from '@/components/ui/button/Button.vue'

defineProps<{
  to: RouteLocationRaw
}>()
</script>

<template>
  <RouterLink
    v-slot="{ navigate }"
    :to
    custom
  >
    <Button
      variant="link"
      class="p-0 h-auto"
      @click="navigate"
    >
      <slot />
    </Button>
  </RouterLink>
</template>
