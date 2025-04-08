<script setup lang="ts">
defineProps<{
  icon?: string
  fw?: boolean
}>()
</script>

<template>
  <i class="fa-solid" :class="[icon, { 'fa-fw': fw }]" />
</template>
