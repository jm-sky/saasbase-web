<script setup lang="ts">
defineProps<{
  title?: string
  value?: string
}>()
</script>

<template>
  <div>
    <div class="text-sm text-muted-foreground mb-1">
      <slot name="title">
        {{ title }}
      </slot>
    </div>
    <div class="font-semibold">
      <slot>
        {{ value }}
      </slot>
    </div>
  </div>
</template>
