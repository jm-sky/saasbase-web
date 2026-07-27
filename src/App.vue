<script setup lang="ts">
import { RouterView } from 'vue-router'
import RouteLoadingFallback from '@/components/Layout/RouteLoadingFallback.vue'
import PwaUpdatePrompt from '@/components/PwaUpdatePrompt.vue'
import Toaster from '@/components/ui/toast/Toaster.vue'
import { isRouteLoading } from '@/router/routeLoading'
</script>

<template>
  <div class="relative flex grow w-full min-h-0">
    <RouterView v-slot="{ Component, route }">
      <Suspense>
        <component
          :is="Component"
          :key="route.fullPath"
        />
        <template #fallback>
          <RouteLoadingFallback />
        </template>
      </Suspense>
    </RouterView>

    <div
      v-if="isRouteLoading"
      class="absolute inset-0 z-40"
    >
      <RouteLoadingFallback />
    </div>
  </div>

  <Toaster />
  <PwaUpdatePrompt />
</template>
