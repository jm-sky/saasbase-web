<script setup lang="ts">
import MainNav from '@/components/Dashboard/MainNav.vue';
import Search from '@/components/Dashboard/Search.vue';
import TeamSwitcher from '@/components/Dashboard/TeamSwitcher.vue';
import UserNav from '@/components/Dashboard/UserNav.vue';
</script>

<template>
  <div class="border-b">
    <div class="flex h-16 items-center px-4">
      <TeamSwitcher />
      <MainNav class="mx-6" />
      <div class="ml-auto flex items-center space-x-4">
        <Search />
        <UserNav />
      </div>
    </div>
  </div>
</template>
