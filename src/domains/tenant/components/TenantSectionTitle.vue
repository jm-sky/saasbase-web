<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

<template>
  <div class="flex flex-row items-center justify-between">
    <h3 class="text-lg font-medium">
      <slot>{{ title }}</slot>
    </h3>

    <div v-if="$slots.actions" class="flex flex-row items-center justify-end gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>
