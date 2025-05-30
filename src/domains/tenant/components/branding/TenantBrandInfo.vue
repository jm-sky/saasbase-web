<script setup lang="ts">
import { computed } from 'vue'
import Avatar from '@/components/ui/avatar/Avatar.vue'
import AvatarFallback from '@/components/ui/avatar/AvatarFallback.vue'
import AvatarImage from '@/components/ui/avatar/AvatarImage.vue'
import { useTenantBranding } from '@/domains/tenant/composables/useTenantBranding'

const { tenant, tenantBranding } = useTenantBranding()

const tenantPage = computed(() => `/tenants/${tenant.value?.id}/show/overview`)
</script>

<template>
  <RouterLink v-if="tenant && tenantBranding" :to="tenantPage" class="flex flex-row gap-2 items-center">
    <Avatar>
      <AvatarImage :src="tenant.logoUrl ?? ''" />
      <AvatarFallback>
        {{ tenant.name.charAt(0) }}
      </AvatarFallback>
    </Avatar>
    <div class="flex flex-col gap-1">
      <div class="text-sm font-medium">
        {{ tenantBranding.shortName ?? tenant.name }}
      </div>
    </div>
  </RouterLink>
</template>