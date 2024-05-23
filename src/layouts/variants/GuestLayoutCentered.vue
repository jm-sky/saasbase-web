<script setup lang="ts">
import { RouterLink } from 'vue-router';
import ApplicationLogo from '@/components/ApplicationLogo.vue';
import LayoutConfigurator from '@/components/LayoutConfigurator/LayoutConfigurator.vue';
</script>

<template>
  <div class="isolate min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100 dark:bg-gray-900">
    <div class="mb-2">
      <img
        src="/images/guest-bg.jpg"
        alt="Background"
        class="absolute inset-0 max-w-full object-cover -z-10"
      >

      <RouterLink to="/">
        <ApplicationLogo />
      </RouterLink>
    </div>

    <div class="absolute top-2 right-2 flex flex-row gap-2 items-center p-1 bg-white/50 dark:bg-black/50 rounded-lg backdrop-blur-md">
      <LayoutConfigurator />
    </div>

    <div
      class="w-full sm:max-w-md mt-6 px-6 py-4 bg-white/60 dark:bg-black/60 backdrop-blur-lg shadow-md overflow-hidden sm:rounded-lg scale-95 hover:scale-100 transition"
    >
      <slot />
    </div>
  </div>
</template>
