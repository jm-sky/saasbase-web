<script setup lang="ts">
import { config } from '@/config'
import GuestLayout from '@/layouts/GuestLayout.vue'

const commitHash = __COMMIT_HASH__
const buildDate = __BUILD_DATE__
</script>

<template>
  <GuestLayout>
    <div class="flex flex-col gap-4 min-w-xs p-2">
      <h1 class="text-2xl font-bold">
        Build Info
      </h1>
      <div class="grid grid-cols-[1fr_2fr] gap-2 items-center text-sm">
        <span class="font-semibold">Version</span>
        <span class="rounded border font-mono px-2 py-1 bg-muted/50">{{ commitHash ?? '-' }}</span>
        <span class="font-semibold">Build Date</span>
        <span class="rounded border font-mono px-2 py-1 bg-muted/50">{{ buildDate ?? '-' }}</span>
        <span class="font-semibold">API Base URL</span>
        <span class="rounded border font-mono px-2 py-1 bg-muted/50">{{ config.api.baseUrl }}</span>
        <span class="font-semibold">Pusher Host</span>
        <span class="rounded border font-mono px-2 py-1 bg-muted/50">{{ config.pusher.wsHost }}</span>
      </div>
    </div>
  </GuestLayout>
</template>