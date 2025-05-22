<script setup lang="ts">
// These are available globally thanks to Vite's `define` config
const versionTitle = `Commit: ${__COMMIT_HASH__}, Built: ${__BUILD_DATE__}`
</script>

<template>
  <div :title="versionTitle" class="text-center text-xs">
    version
  </div>
</template>
