<script setup lang="ts">
defineProps<{
  title?: string
  subtitle?: string
}>()
</script>

<template>
  <div class="flex flex-row items-center justify-between">
    <div class="min-h-9">
      <h3 class="text-lg font-medium">
        <slot>{{ title }}</slot>
      </h3>
      <p v-if="subtitle" class="text-muted-foreground">
        {{ subtitle }}
      </p>
    </div>

    <div v-if="$slots.actions" class="flex flex-row items-center justify-end gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>
