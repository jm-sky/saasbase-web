<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import AccountMenu from './partials/AccountMenu.vue'
</script>

<template>
  <AuthenticatedLayout>
    <!-- Container -->
    <div class="p-4">
      <div class="flex flex-row items-center justify-between py-3 mb-2">
        <h1 class="text-2xl font-semibold pl-4">
          Account Settings
        </h1>
        <Button variant="outline">
          Public profile
        </Button>
      </div>
      <div class="flex grow gap-5 lg:gap-7.5">
        <AccountMenu />
        <div class="flex flex-col items-stretch grow gap-5 lg:gap-7.5">
          <RouterView />
        </div>
      </div>
    </div>
    <!-- End of Container -->
  </AuthenticatedLayout>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
