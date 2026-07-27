<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuthStore } from '@/domains/auth/store/auth.store'

const { t } = useI18n()
const authStore = useAuthStore()
</script>

<template>
  <div
    class="flex w-full grow bg-sidebar min-h-svh"
    role="status"
    aria-live="polite"
    :aria-busy="true"
    :aria-label="t('common.loading')"
  >
    <template v-if="authStore.isAuthenticated">
      <aside class="hidden md:flex w-[var(--sidebar-width)] shrink-0 flex-col gap-3 p-4">
        <Skeleton class="h-10 w-full" />
        <Skeleton class="h-4 w-20 mt-2" />
        <Skeleton v-for="index in 8" :key="index" class="h-8 w-full" />
      </aside>

      <div class="flex min-w-0 flex-1 flex-col">
        <header class="flex h-16 shrink-0 items-center gap-2 px-4">
          <Skeleton class="size-8 rounded-md" />
          <Skeleton class="hidden md:block h-8 w-40" />
          <div class="ml-auto flex items-center gap-2">
            <Skeleton class="hidden md:block h-9 w-40" />
            <Skeleton class="size-8 rounded-full" />
            <Skeleton class="size-8 rounded-full" />
          </div>
        </header>

        <div class="bg-background flex flex-1 flex-col m-0 md:mr-4 md:mb-2 border rounded-xl shadow-lg p-4 md:p-8 space-y-6">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <Skeleton class="h-8 w-48" />
            <div class="flex gap-2">
              <Skeleton class="h-9 w-28" />
              <Skeleton class="h-9 w-32" />
            </div>
          </div>
          <Skeleton class="h-10 w-full" />
          <div class="space-y-3">
            <Skeleton v-for="row in 6" :key="row" class="h-12 w-full" />
          </div>
        </div>
      </div>
    </template>

    <div v-else class="flex grow items-center justify-center p-8">
      <div class="w-full max-w-md space-y-4">
        <Skeleton class="mx-auto h-10 w-2/3" />
        <Skeleton class="h-40 w-full" />
        <Skeleton class="h-10 w-full" />
      </div>
    </div>
  </div>
</template>
