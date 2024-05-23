<script setup lang="ts">
import LayoutConfigurator from '@/components/LayoutConfigurator/LayoutConfigurator.vue';
import UIIcon from '@/components/UIIcon.vue';
</script>

<template>
  <div class="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
    <div class="relative h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
      <div class="absolute inset-0 bg-primary-950" />
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

    <div class="absolute top-2 right-2 flex flex-row gap-2 items-center p-1 bg-white/50 dark:bg-black/50 rounded-lg backdrop-blur-md">
      <LayoutConfigurator />
    </div>
  </div>
</template>
