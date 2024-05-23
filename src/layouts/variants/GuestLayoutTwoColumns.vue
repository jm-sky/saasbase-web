<script setup lang="ts">
import { useDark } from '@vueuse/core';
import DarkModeButton from '@/components/DarkModeButton.vue';
import LayoutConfigurator from '@/components/LayoutConfigurator/LayoutConfigurator.vue';
import UIIcon from '@/components/UIIcon.vue';

const isDark = useDark();
</script>

<template>
  <div class="container relative h-screen flex flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
    <div class="relative h-full flex-col bg-muted p-10 text-white dark:border-r hidden lg:flex">
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
          class="absolute inset-0 w-full h-full object-cover"
        >
        <img
          v-if="isDark"
          src="/images/guest-bg-dark.jpg"
          alt="Background"
          class="absolute inset-0 w-full h-full object-cover"
        >
      </TransitionGroup>

      <div class="absolute inset-0 bg-primary-950/50" />

      <div class="relative z-20 flex flex-col items-center gap-5 h-full justify-center text-lg font-medium">
        <UIIcon
          icon="lucide:rocket"
          class="text-6xl text-primary"
        />
        <div class="text-4xl font-bold">
          YOUR app
        </div>
        <p class="text-white/85">
          You should login before accessing the full content of our app...
        </p>
      </div>
    </div>
    <div class="lg:p-8">
      <slot />
    </div>

    <div class="absolute top-1 right-1 flex flex-row gap-2 items-center p-1 bg-white/50 dark:bg-black/50 rounded-lg backdrop-blur-md transition-colors">
      <DarkModeButton />
      <LayoutConfigurator />
    </div>
  </div>
</template>
