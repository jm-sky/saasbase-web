<script setup lang="ts">
import MainNav from './MainNav.vue';
import Search from '@/components/Dashboard/Search.vue';
import UserNav from '@/components/Dashboard/UserNav.vue';
import DarkModeButton from '@/components/DarkModeButton.vue';
import ThemeColorButton from '@/components/ThemeColorButton.vue';
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
