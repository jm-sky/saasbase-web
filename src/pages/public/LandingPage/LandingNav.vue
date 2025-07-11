<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import ButtonLink from '@/components/ButtonLink.vue'
import DarkModeButton from '@/components/DarkModeButton.vue'
import LanguageSwitchDropdown from '@/components/LanguageSwitchDropdown.vue'
import { useAuthStore } from '@/domains/auth/store/auth.store'
import { routeMap } from '@/router/routeMap'

const { t } = useI18n()
const authStore = useAuthStore()
const route = useRoute()

const loginRoute = computed(() => ({
  name: routeMap.auth.login,
  query: {
    next: route.query.next,
  },
}))
</script>

<template>
  <nav class="bg-background border-b border-border sticky top-0 z-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center">
          <h1 class="text-2xl font-bold">
            <span class="text-foreground">Saas</span>
            <span class="text-primary font-normal">Base</span>
          </h1>
        </div>
        <div class="flex items-center space-x-4">
          <DarkModeButton variant="ghost-primary" class="rounded-full hidden md:inline-flex" />
          <LanguageSwitchDropdown variant="ghost-primary" class="rounded-full hidden md:inline-flex" />

          <ButtonLink
            v-if="!authStore.isAuthenticated"
            variant="outline"
            size="sm"
            :to="loginRoute"
          >
            {{ t('landing.nav.login') }}
          </ButtonLink>

          <ButtonLink
            v-else
            variant="outline"
            size="sm"
            to="/"
          >
            {{ t('dashboard.title') }}
          </ButtonLink>

          <ButtonLink
            variant="primary"
            to="/register"
            vibe="primary"
          >
            {{ t('landing.nav.tryFree') }}
          </ButtonLink>
        </div>
      </div>
    </div>
  </nav>
</template>
