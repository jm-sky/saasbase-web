<script setup lang="ts">
defineProps<{
  label: string
  value?: string | null
}>()
</script>

<template>
  <div class="font-semibold">
    {{ label }}
  </div>
  <div class="">
    {{ value ?? 'N/A' }}
  </div>
</template>