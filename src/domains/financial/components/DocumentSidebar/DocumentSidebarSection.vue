<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <div class="uppercase text-sm font-bold text-muted-foreground">
    {{ title }}
  </div>
  <div class="flex flex-col gap-4">
    <slot />
  </div>
</template>
