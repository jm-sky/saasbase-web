<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ITenant } from '@/domains/tenant/types/tenant.type'

const { t } = useI18n()

const { tenant } = defineProps<{
  tenant?: ITenant
}>()

const navigationItems = computed(() => [
  { name: t('tenant.billing.overview.title'), path: `/tenants/${tenant?.id}/show/billing/overview`, icon: 'heroicons:credit-card' },
  { name: t('tenant.billing.plans.title'), path: `/tenants/${tenant?.id}/show/billing/plans`, icon: 'heroicons:document-text' },
  { name: t('tenant.billing.history.title'), path: `/tenants/${tenant?.id}/show/billing/history`, icon: 'heroicons:clock' },
])
</script>

<template>
  <div class="flex flex-col gap-2 border rounded-md p-4 shadow-lg/5">
    <!-- Navigation -->
    <div class="flex flex-row gap-4 flex-wrap items-center border-b mb-4">
      <RouterLink
        v-for="item in navigationItems"
        :key="item.path"
        :to="item.path"
        class="flex items-center gap-3 px-3 py-2 text-sm transition-colors"
        active-class="text-primary border-b-2 border-primary"
      >
        <Icon :icon="item.icon" class="size-5" />
        {{ item.name }}
      </RouterLink>
    </div>

    <!-- Main Content -->
    <div class="flex-1">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" :tenant />
        </Transition>
      </RouterView>
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
