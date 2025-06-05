<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import TenantIntegrationConfigList from '@/domains/tenant/components/TenantIntegrationConfigList.vue'
import TenantSectionTitle from '@/domains/tenant/components/TenantSectionTitle.vue'

const { t } = useI18n()
</script>

<template>
  <div class="flex flex-col gap-2 border rounded-md p-4 shadow-lg/5">
    <TenantSectionTitle :title="t('tenant.integrations.title')" />
    <TenantIntegrationConfigList />
  </div>
</template>