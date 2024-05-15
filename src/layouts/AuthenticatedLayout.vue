<script setup lang="ts">
import TopBar from './partials/TopBar.vue';
</script>

<template>
  <div>
    <TopBar />
    <main>
      <slot />
    </main>
  </div>
</template>
