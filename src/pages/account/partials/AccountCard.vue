<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <div class="kt-card flex flex-col grow rounded-lg bg-card pb-2.5">
    <div id="basic_settings" class="kt-card-header flex items-center border-b min-h-12">
      <h3 class="kt-card-title font-semibold">
        {{ title }}
      </h3>
    </div>
    <div class="kt-card-content grid gap-5">
      <slot />
    </div>
  </div>
</template>
