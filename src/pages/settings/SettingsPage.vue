<script setup lang="ts">
import { Separator } from '@/components/ui/separator'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import SidebarNav from './partials/SidebarNav.vue'
</script>

<template>
  <AuthenticatedLayout>
    <div class="px-8 pt-6 space-y-6 p-10 pb-16 md:block">
      <div class="space-y-0.5">
        <h2 class="text-2xl font-bold tracking-tight">
          Settings
        </h2>
        <p class="text-muted-foreground">
          Manage your account settings and set e-mail preferences.
        </p>
      </div>
      <Separator class="my-6" />
      <div class="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside class="lg:w-48">
          <SidebarNav />
        </aside>
        <div class="flex-1 lg:max-w-2xl">
          <div class="space-y-6">
            <RouterView />
          </div>
        </div>
      </div>
    </div>
  </AuthenticatedLayout>
</template>
