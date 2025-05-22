<script setup lang="ts">
import { Icon } from '@iconify/vue'

const navigationItems = [
  { name: 'Get Started', path: '/account/security', icon: 'heroicons:shield-check' },
  { name: 'Privacy Settings', path: '/account/security/privacy', icon: 'heroicons:shield-check' },
  { name: 'Device Management', path: '/account/security/devices', icon: 'heroicons:device-phone-mobile' },
  { name: 'Security Log', path: '/account/security/log', icon: 'heroicons:clipboard-document-list' },
  { name: 'Current Sessions', path: '/account/security/sessions', icon: 'heroicons:clock' },
]
</script>

<template>
  <div class="flex flex-col lg:flex-row gap-5">
    <!-- Sidebar -->
    <div class="w-full lg:w-64 flex-shrink-0">
      <div class="card">
        <div class="p-5">
          <h3 class="text-lg font-semibold">
            Security Settings
          </h3>
          <p class="text-sm text-muted-foreground">
            Manage your account security and privacy settings
          </p>
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
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
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
