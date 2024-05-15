<script setup lang="ts">
import DarkModeButton from '@/components/DarkModeButton.vue';
import Search from '@/components/Dashboard/Search.vue';
import UserNav from '@/components/Dashboard/UserNav.vue';
import ThemeColorButton from '@/components/ThemeColorButton.vue';
import MainNav from './MainNav.vue';
</script>

<template>
  <div class="border-b">
    <div class="flex h-16 items-center px-4">
      <MainNav class="mx-6" />
      <div class="ml-auto flex items-center gap-2">
        <Search />
        <DarkModeButton />
        <ThemeColorButton />
        <UserNav />
      </div>
    </div>
  </div>
</template>
