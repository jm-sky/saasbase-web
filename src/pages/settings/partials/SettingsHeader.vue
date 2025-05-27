<script setup lang="ts">
defineProps<{
  title: string
  description: string
}>()
</script>

<template>
  <div class="flex flex-row gap-4 items-center justify-between h-15">
    <div>
      <h3 class="text-lg font-medium">
        {{ title }}
      </h3>
      <p class="text-sm text-muted-foreground">
        {{ description }}
      </p>
    </div>

    <div v-if="$slots.right" class="flex gap-2 items-center justify-end">
      <slot name="right" />
    </div>
  </div>
</template>