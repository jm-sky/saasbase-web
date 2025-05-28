<script setup lang="ts">
import { AlertTriangle } from 'lucide-vue-next'
import { computed } from 'vue'
import { useAuthStore } from '@/domains/auth/store/auth.store'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import GuestLayout from '@/layouts/GuestLayout.vue'

const layout = computed(() => {
  return useAuthStore().isAuthenticated ? AuthenticatedLayout : GuestLayout
})
</script>

<template>
  <component :is="layout">
    <div class="px-4 md:px-8 py-4 md:py-6 mx-auto">
      <div class="flex flex-col items-center gap-2 p-8 mb-6 mx-auto text-center w-xl">
        <h1 class="text-2xl font-bold">
          404
        </h1>
        <div>
          Page not found
        </div>
        <AlertTriangle class="size-30 opacity-10" />
      </div>
    </div>
  </component>
</template>