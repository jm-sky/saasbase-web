<script setup lang="ts">
import { onMounted } from 'vue'
import { useAccountStore } from '@/domains/account/stores/account.store'

const store = useAccountStore()

onMounted(async () => {
  if (!store.isProfileLoaded) {
    await store.fetchProfile()
  }
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-semibold">
        Get Started
      </h2>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="card p-6">
        <h3 class="text-lg font-semibold mb-4">
          Complete Your Profile
        </h3>
        <p class="text-muted-foreground mb-4">
          Add your personal information to help us personalize your experience.
        </p>
        <RouterLink
          to="/account/profile"
          class="text-primary hover:underline"
        >
          Go to Profile →
        </RouterLink>
      </div>

      <div class="card p-6">
        <h3 class="text-lg font-semibold mb-4">
          Security Settings
        </h3>
        <p class="text-muted-foreground mb-4">
          Review and update your security preferences to keep your account safe.
        </p>
        <RouterLink
          to="/account/security"
          class="text-primary hover:underline"
        >
          Go to Security →
        </RouterLink>
      </div>

      <div class="card p-6">
        <h3 class="text-lg font-semibold mb-4">
          Notification Preferences
        </h3>
        <p class="text-muted-foreground mb-4">
          Choose what notifications you want to receive and how.
        </p>
        <RouterLink
          to="/account/notifications"
          class="text-primary hover:underline"
        >
          Go to Notifications →
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference '../../style/index.css';

.card {
  @apply border border-muted rounded-lg p-6 shadow-sm text-sm;
}
</style>