<script setup lang="ts">
defineProps<{
  label: string
}>()
</script>

<template>
  <div class="col-span-full font-semibold">
    {{ label }}
  </div>

  <div class="col-span-full grid grid-cols-[1fr_2fr] gap-2 border-l-4 border-border p-2 mb-2">
    <slot />
  </div>
</template>