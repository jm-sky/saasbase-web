<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ButtonLink from '@/components/ButtonLink.vue'
import { useAuthStore } from '@/domains/auth/store/auth.store'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import GuestLayout from '@/layouts/GuestLayout.vue'

const { t } = useI18n()

const layout = computed(() => {
  return useAuthStore().isAuthenticated ? AuthenticatedLayout : GuestLayout
})
</script>

<template>
  <component :is="layout">
    <div class="px-4 md:px-8 py-4 md:py-10 mx-auto">
      <div class="text-center">
        <p class="text-base font-semibold text-primary">
          404
        </p>
        <h1 class="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-6xl">
          {{ t('common.error404.title') }}
        </h1>
        <p class="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
          {{ t('common.error404.description') }}
        </p>
        <div class="mt-10 flex items-center justify-center gap-x-6">
          <ButtonLink to="/" variant="primary">
            {{ t('common.error404.goBackHome') }}
          </ButtonLink>
        </div>
      </div>
    </div>
  </component>
</template>