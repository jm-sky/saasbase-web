<script setup lang="ts">
import { CreditCard, Home, Settings } from 'lucide-vue-next'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ButtonLink from '@/components/ButtonLink.vue'
import { useTenantStore } from '@/domains/tenant/store/tenant.store'
import GuestLayout from '@/layouts/GuestLayout.vue'

const { t } = useI18n()
const tenantStore = useTenantStore()

const tenantId = computed(() => tenantStore.tenantId)
</script>

<template>
  <GuestLayout content-class="mx-auto p-6 flex flex-col gap-4">
    <h1 class="text-2xl font-bold text-center">
      {{ t('tenant.welcome.title') }}
    </h1>
    <p class="text-center text-muted-foreground">
      {{ t('tenant.welcome.description') }}
    </p>

    <ButtonLink variant="outline" to="/dashboard" class="mx-auto w-full h-24 flex items-center justify-center gap-4 px-8!">
      <Home class="size-8 opacity-50" />
      <div class="flex flex-col gap-2 w-full">
        <div class="text-lg font-semibold">
          {{ t('dashboard.title') }}
        </div>
        <div class="text-sm text-muted-foreground">
          {{ t('dashboard.description') }}
        </div>
      </div>
    </ButtonLink>

    <ButtonLink variant="outline" :to="`/tenants/${tenantId}/show/overview`" class="mx-auto w-full h-24 flex items-center justify-center gap-4 px-8!">
      <Settings class="size-8 opacity-50" />
      <div class="flex flex-col gap-2 w-full">
        <div class="text-lg font-semibold">
          {{ t('settings.title') }}
        </div>
        <div class="text-sm text-muted-foreground">
          {{ t('tenant.overview.description') }}
        </div>
      </div>
    </ButtonLink>

    <ButtonLink variant="outline" :to="`/tenants/${tenantId}/show/billing/plans`" class="mx-auto w-full h-24 flex items-center justify-center gap-4 px-8!">
      <CreditCard class="size-8 opacity-50" />
      <div class="flex flex-col gap-2 w-full">
        <div class="text-lg font-semibold">
          {{ t('tenant.billing.plans.title') }}
        </div>
        <div class="text-sm text-muted-foreground">
          {{ t('tenant.billing.plans.description') }}
        </div>
      </div>
    </ButtonLink>
  </GuestLayout>
</template>