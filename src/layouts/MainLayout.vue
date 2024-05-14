<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
  <div>
    <nav class="topbar sticky top-0 bg-primary/5 flex flex-row items-center justify-between gap-2 border-b py-1 px-2">
      <div class="font-bold">
        App
      </div>
      <div class="navigation flex flex-row items-center justify-end gap-2 text-sm">
        <RouterLink
          class="link"
          active-class="active"
          to="/"
        >
          Home
        </RouterLink>
        <RouterLink
          class="link"
          active-class="active"
          to="/about"
        >
          About
        </RouterLink>
        <RouterLink
          class="link"
          active-class="active"
          to="/mailbox"
        >
          MailBox
        </RouterLink>
      </div>
    </nav>
    <main>
      <slot />
    </main>
  </div>
</template>

<style>
.topbar .navigation .link {
  @apply border-b-2 border-transparent hover:border-primary transition-colors -mb-1.5 py-1 px-2;
  
  &.active {
    @apply border-primary;
  }
}
</style>
