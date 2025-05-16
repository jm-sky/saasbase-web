<script setup lang="ts">
defineProps<{
  label: string
  value?: string
}>()
</script>

<template>
  <div class="flex flex-col gap-0.5">
    <div class="font-semibold">
      {{ label }}
    </div>
    <div class="text-gray-500">
      <slot>
        {{ value ?? '-' }}
      </slot>
    </div>
  </div>
</template>