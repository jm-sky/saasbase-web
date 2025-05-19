<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAccountStore } from '@/domains/account/stores/account.store'

const store = useAccountStore()
const loading = ref(false)

onMounted(async () => {
  if (!store.isSettingsLoaded) {
    loading.value = true
    try {
      await store.fetchSettings()
    } catch {
      // Error is already handled by the service
    } finally {
      loading.value = false
    }
  }
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-semibold">
        Security Setup
      </h2>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="card p-6">
        <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <span class="text-xl text-primary">🔒</span>
        </div>
        <h3 class="text-lg font-semibold mb-2">
          Two-Factor Authentication
        </h3>
        <p class="text-muted-foreground mb-4">
          Add an extra layer of security to your account by enabling two-factor authentication.
        </p>
        <div class="flex items-center gap-2">
          <span
            class="px-2 py-1 rounded-full text-xs"
            :class="store.settings?.twoFactorEnabled ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'"
          >
            {{ store.settings?.twoFactorEnabled ? 'Enabled' : 'Not Enabled' }}
          </span>
        </div>
        <RouterLink
          to="/account/security"
          class="mt-4 inline-block text-primary hover:underline"
        >
          Configure →
        </RouterLink>
      </div>

      <div class="card p-6">
        <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <span class="text-xl text-primary">📱</span>
        </div>
        <h3 class="text-lg font-semibold mb-2">
          Device Management
        </h3>
        <p class="text-muted-foreground mb-4">
          Review and manage devices that have access to your account.
        </p>
        <RouterLink
          to="/account/security/devices"
          class="mt-4 inline-block text-primary hover:underline"
        >
          Manage Devices →
        </RouterLink>
      </div>

      <div class="card p-6">
        <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <span class="text-xl text-primary">🔑</span>
        </div>
        <h3 class="text-lg font-semibold mb-2">
          API Keys
        </h3>
        <p class="text-muted-foreground mb-4">
          Manage your API keys for secure access to our services.
        </p>
        <RouterLink
          to="/account/api-keys"
          class="mt-4 inline-block text-primary hover:underline"
        >
          Manage API Keys →
        </RouterLink>
      </div>

      <div class="card p-6">
        <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <span class="text-xl text-primary">📝</span>
        </div>
        <h3 class="text-lg font-semibold mb-2">
          Security Log
        </h3>
        <p class="text-muted-foreground mb-4">
          Review your account's security activity and login history.
        </p>
        <RouterLink
          to="/account/security/log"
          class="mt-4 inline-block text-primary hover:underline"
        >
          View Log →
        </RouterLink>
      </div>

      <div class="card p-6">
        <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <span class="text-xl text-primary">🔔</span>
        </div>
        <h3 class="text-lg font-semibold mb-2">
          Security Alerts
        </h3>
        <p class="text-muted-foreground mb-4">
          Configure how you want to be notified about security events.
        </p>
        <RouterLink
          to="/account/notifications"
          class="mt-4 inline-block text-primary hover:underline"
        >
          Configure Alerts →
        </RouterLink>
      </div>

      <div class="card p-6">
        <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <span class="text-xl text-primary">📋</span>
        </div>
        <h3 class="text-lg font-semibold mb-2">
          Privacy Settings
        </h3>
        <p class="text-muted-foreground mb-4">
          Manage your privacy preferences and data sharing settings.
        </p>
        <RouterLink
          to="/account/security/privacy"
          class="mt-4 inline-block text-primary hover:underline"
        >
          Privacy Settings →
        </RouterLink>
      </div>
    </div>
  </div>
</template>
