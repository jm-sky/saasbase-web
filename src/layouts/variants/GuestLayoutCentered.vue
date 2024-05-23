<script setup lang="ts">
import { useDark } from '@vueuse/core';
import { RouterLink } from 'vue-router';
import ApplicationLogo from '@/components/ApplicationLogo.vue';
import DarkModeButton from '@/components/DarkModeButton.vue';
import LayoutConfigurator from '@/components/LayoutConfigurator/LayoutConfigurator.vue';

const isDark = useDark();
</script>

<template>
  <div class="isolate min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100 dark:bg-gray-900">
    <div class="mb-2">
      <TransitionGroup
        enter-from-class="opacity-0"
        enter-active-class="transition-opacity duration-1000"
        enter-to-class="opacity-100"
        leave-from-class="opacity-100"
        leave-active-class="transition-opacity duration-1000"
        leave-to-class="opacity-0"
      >
        <img
          v-if="!isDark"
          src="/images/guest-bg.jpg"
          alt="Background"
          class="absolute inset-0 w-full h-full object-cover -z-10"
        >
        <img
          v-if="isDark"
          src="/images/guest-bg-dark.jpg"
          alt="Background"
          class="absolute inset-0 w-full h-full object-cover -z-10"
        >
      </TransitionGroup>

      <RouterLink to="/">
        <ApplicationLogo />
      </RouterLink>
    </div>

    <div class="absolute top-1 right-1 flex flex-row gap-2 items-center p-1 bg-white/30 dark:bg-black/50 rounded-lg backdrop-blur-md transition-colors">
      <DarkModeButton />
      <LayoutConfigurator />
    </div>

    <div
      class="w-full sm:max-w-md mt-6 px-6 py-4 bg-white/60 dark:bg-black/60 backdrop-blur-lg shadow-md overflow-hidden sm:rounded-lg transition-colors duration-1000"
    >
      <slot />
    </div>
  </div>
</template>
