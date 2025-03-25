<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme.store'
import GuestLayoutCentered from './variants/GuestLayoutCentered.vue'
import GuestLayoutTwoColumns from './variants/GuestLayoutTwoColumns.vue'

const themeStore = useThemeStore()

const layoutComponent = computed(() => {
  if (themeStore.guestLayoutVariant === 'centered') return GuestLayoutCentered

  return GuestLayoutTwoColumns
})
</script>

<template>
  <component :is="layoutComponent">
    <slot />
  </component>
</template>
