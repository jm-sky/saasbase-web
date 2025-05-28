<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

<template>
  <h3 class="text-lg font-medium">
    <slot>{{ title }}</slot>
  </h3>
</template>