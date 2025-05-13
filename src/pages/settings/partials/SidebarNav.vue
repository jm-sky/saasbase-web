<script setup lang="ts">
import ButtonLink from '@/components/ButtonLink.vue'

interface Item {
  title: string
  to: string
  disabled?: boolean
}

const sidebarNavItems: Item[] = [
  {
    title: 'Profile',
    to: '/settings/profile',
  },
  {
    title: 'Account',
    to: '/settings/account',
  },
  {
    title: 'Appearance',
    to: '/settings/appearance',
  },
  {
    title: 'Notifications',
    to: '/settings/notifications',
    disabled: true,
  },
]
</script>

<template>
  <nav class="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
    <ButtonLink
      v-for="({ title, to, disabled }) in sidebarNavItems"
      :key="title"
      :to
      variant="ghost"
      class="w-full text-left justify-start"
      active-class="bg-secondary/80 text-primary"
      :disabled
    >
      {{ title }}
    </ButtonLink>
  </nav>
</template>
