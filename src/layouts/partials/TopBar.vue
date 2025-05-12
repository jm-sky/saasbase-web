<script setup lang="ts">
import DarkModeButton from '@/components/DarkModeButton.vue'
import Search from '@/components/Dashboard/Search.vue'
import UserNav from '@/components/Layout/UserNav.vue'
import ThemeColorButton from '@/components/LayoutConfigurator/ThemeColorButton.vue'
import TopbarNav from './TopbarNav.vue'

const SHOW_NAV = false
</script>

<template>
  <div class="border-b">
    <div class="flex h-16 items-center px-4">
      <TopbarNav v-if="SHOW_NAV" class="hidden md:block mx-6" />
      <div class="ml-auto flex items-center gap-2">
        <Search class="hidden md:block" />
        <DarkModeButton />
        <ThemeColorButton />
        <UserNav />
      </div>
    </div>
  </div>
</template>
