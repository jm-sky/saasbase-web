<script setup lang="ts">
interface INavigationSection {
  title: string
  items: INavigationItem[]
}

interface INavigationItem {
  name: string
  path: string
  icon: string
  disabled?: boolean
}

const navigationSections: INavigationSection[] = [
  {
    title: 'Basic Settings',
    items: [
      { name: 'Get Started', path: '/account', icon: 'heroicons:user' },
      { name: 'Profile', path: '/account/profile', icon: 'heroicons:user' },
      { name: 'Settings', path: '/account/settings', icon: 'heroicons:cog-6-tooth' },
    ]
  },
  {
    title: 'Authentication',
    items: [
      { name: 'Email', path: '/account/auth/email', icon: 'heroicons:envelope', disabled: true },
      { name: 'Social Sign in', path: '/account/auth/social', icon: 'heroicons:user-group', disabled: true },
      { name: 'Two-Factor auth (2FA)', path: '/account/auth/2fa', icon: 'heroicons:shield-check', disabled: true },
      { name: 'Single Sign On (SSO)', path: '/account/auth/sso', icon: 'heroicons:key', disabled: true },
      { name: 'Password', path: '/account/auth/password', icon: 'heroicons:lock-closed', disabled: true },
    ]
  },
  {
    title: 'Advanced Settings',
    items: [
      { name: 'Preferences', path: '/account/preferences', icon: 'heroicons:cog', disabled: true  },
      { name: 'Appearance', path: '/account/appearance', icon: 'heroicons:paint-brush' },
      { name: 'Notifications', path: '/account/notifications', icon: 'heroicons:bell' },
      { name: 'Address', path: '/account/address', icon: 'heroicons:map-pin', disabled: true  },
    ]
  },
  {
    title: 'External Services',
    items: [
      { name: 'Manage API', path: '/account/api-keys', icon: 'heroicons:key' },
      { name: 'Integrations', path: '/account/integrations', icon: 'heroicons:puzzle-piece', disabled: true  },
    ]
  },
  {
    title: 'Account',
    items: [
      { name: 'Billing', path: '/account/billing', icon: 'heroicons:credit-card' },
      { name: 'Activity', path: '/account/activity', icon: 'heroicons:clock' },
      { name: 'Invite a Friend', path: '/account/invite', icon: 'heroicons:user-plus' },
      { name: 'Delete Account', path: '/account/delete', icon: 'heroicons:trash', disabled: true },
    ]
  }
]
</script>

<template>
  <div class="hidden lg:block w-[230px] shrink-0">
    <div
      class="w-[230px]"
      data-kt-sticky="true"
      data-kt-sticky-animation="true"
      data-kt-sticky-class="fixed z-4 left-auto top-[calc(var(--header-height)+1rem)]"
      data-kt-sticky-name="scrollspy"
      data-kt-sticky-offset="200"
      data-kt-sticky-target="body"
    >
      <div
        class="flex flex-col grow relative before:absolute before:left-[11px] before:top-0 before:bottom-0"
        data-kt-scrollspy="true"
        data-kt-scrollspy-offset="110px"
        data-kt-scrollspy-target="body"
      >
        <template v-for="(section, index) in navigationSections" :key="index">
          <div class="flex flex-col">
            <div class="pl-6 pr-2.5 py-2 text-sm font-semibold text-mono">
              {{ section.title }}
            </div>
            <div class="flex flex-col">
              <template v-for="(item, itemIndex) in section.items" :key="itemIndex">
                <RouterLink
                  v-if="!item.disabled"
                  :key="item.path"
                  :to="item.path"
                  class="flex items-center rounded-lg px-2.5 py-2 gap-3.5 border border-transparent text-sm text-foreground hover:text-primary hover:font-medium kt-scrollspy-active:bg-secondary-active kt-scrollspy-active:text-primary kt-scrollspy-active:font-medium hover:rounded-lg"
                  active-class="kt-scrollspy-active"
                  exact-active-class="[&>span]:before:bg-primary text-primary font-semibold"
                  :data-kt-scrollspy-anchor="true"
                >
                  <span class="flex w-1.5 relative before:absolute before:top-0 before:size-1.5 before:rounded-full before:-translate-x-2/4 before:-translate-y-2/4 kt-scrollspy-active:before:bg-primary" />
                  {{ item.name }}
                </RouterLink>
                <div
                  v-else
                  class="opacity-50 flex items-center rounded-lg px-2.5 py-2 gap-3.5 border border-transparent text-sm text-foreground kt-scrollspy-active:bg-secondary-active kt-scrollspy-active:text-primary kt-scrollspy-active:font-medium hover:rounded-lg"
                >
                  <span class="flex w-1.5 relative before:absolute before:top-0 before:size-1.5 before:rounded-full before:-translate-x-2/4 before:-translate-y-2/4 kt-scrollspy-active:before:bg-primary" />
                  {{ item.name }}
                </div>
              </template>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
