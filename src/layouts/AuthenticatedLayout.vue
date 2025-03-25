<script setup lang="ts">
import TopBar from './partials/TopBar.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <TopBar />
    <main class="flex flex-col h-full grow">
      <slot />
    </main>
  </div>
</template>
