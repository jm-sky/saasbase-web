<script setup lang="ts">
import DarkModeButton from '@/components/DarkModeButton.vue'
import Search from '@/components/Dashboard/Search.vue'
import UserNav from '@/components/Layout/UserNav.vue'
import ThemeColorButton from '@/components/LayoutConfigurator/ThemeColorButton.vue'
import TopbarNav from './TopbarNav.vue'
</script>

<template>
  <div class="border-b">
    <div class="flex h-16 items-center px-4">
      <TopbarNav class="hidden md:block mx-6" />
      <div class="ml-auto flex items-center gap-2">
        <Search />
        <DarkModeButton />
        <ThemeColorButton />
        <UserNav />
      </div>
    </div>
  </div>
</template>
