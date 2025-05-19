<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed, onMounted } from 'vue'
import { useAccountStore } from '@/domains/account/stores/account.store'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'

const store = useAccountStore()
const profile = computed(() => store.profile)
const fullName = computed(() => store.fullName)

const initials = computed(() => {
  if (!profile.value) return ''
  return `${profile.value.firstName[0]}${profile.value.lastName[0]}`
})

const navigationItems = [
  { name: 'Get Started', path: '/account', icon: 'heroicons:user' },
  { name: 'Profile', path: '/account/profile', icon: 'heroicons:user' },
  { name: 'Settings', path: '/account/settings', icon: 'heroicons:cog-6-tooth' },
  { name: 'Notifications', path: '/account/notifications', icon: 'heroicons:bell' },
  { name: 'Appearance', path: '/account/appearance', icon: 'heroicons:paint-brush' },
  { name: 'Invite a Friend', path: '/account/invite', icon: 'heroicons:user-plus' },
  { name: 'Activity', path: '/account/activity', icon: 'heroicons:clock' },
  { name: 'Security', path: '/account/security', icon: 'heroicons:shield-check' },
  { name: 'API Keys', path: '/account/api-keys', icon: 'heroicons:key' },
  { name: 'Billing', path: '/account/billing', icon: 'heroicons:credit-card' },
]

// Fetch profile data when component is mounted
onMounted(async () => {
  await store.fetchProfile()
})
</script>

<template>
  <AuthenticatedLayout>
    <div class="flex flex-col lg:flex-row gap-5">
      <!-- Sidebar -->
      <div class="w-full lg:w-64 flex-shrink-0">
        <div class="card">
          <div class="p-5">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <span class="text-2xl text-primary">{{ initials }}</span>
              </div>
              <div>
                <h3 class="text-lg font-semibold">
                  {{ fullName }}
                </h3>
                <p class="text-muted-foreground">
                  {{ profile?.email }}
                </p>
              </div>
            </div>
          </div>
          <div class="border-t">
            <nav class="p-2">
              <RouterLink
                v-for="item in navigationItems"
                :key="item.path"
                :to="item.path"
                class="flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors"
                :class="[
                  $route.path === item.path
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                ]"
              >
                <Icon :icon="item.icon" class="w-5 h-5" />
                {{ item.name }}
              </RouterLink>
            </nav>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex-1">
        <RouterView v-slot="{ Component }">
          <Transition name="fade" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </div>
    </div>
  </AuthenticatedLayout>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
