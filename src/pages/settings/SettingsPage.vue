<script setup lang="ts">
import ButtonLink from '@/components/ButtonLink.vue'
import { Separator } from '@/components/ui/separator'
import { useAuthStore } from '@/domains/auth/store/auth.store'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { routeTo } from '@/router/routeMap'
import SettingsSidebarMenu from './partials/SettingsSidebarMenu.vue'

const { user } = useAuthStore()
</script>

<template>
  <AuthenticatedLayout>
    <div class="px-6 md:px-8 pt-6 space-y-6 p-10 pb-16 md:block">
      <div class="flex justify-between items-center gap-2">
        <div class="space-y-0.5">
          <h2 class="text-2xl font-bold tracking-tight">
            {{ $t('settings.title') }}
          </h2>
          <p class="text-muted-foreground">
            {{ $t('settings.description') }}
          </p>
        </div>
        <div>
          <ButtonLink :to="routeTo.userPublicProfile(user?.id ?? '')" variant="primary">
            {{ $t('settings.publicProfile.title') }}
          </ButtonLink>
        </div>
      </div>
      <Separator class="my-6" />
      <div class="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside class="lg:w-48">
          <SettingsSidebarMenu />
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
