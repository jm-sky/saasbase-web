<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import EntityDetailsLayout from '@/components/layouts/EntityDetailsLayout.vue'
import TabLink from '@/components/ui/tabs/TabLink.vue'
import { tenantService } from '@/domains/tenant/services/TenantService'
import { useTenantStore } from '@/domains/tenant/store/tenant.store'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'

const { t } = useI18n()
const route = useRoute()
const tenantStore = useTenantStore()
const tenantId = route.params.id as string

const { tenant } = storeToRefs(tenantStore)

const loading = ref(false)
const error = ref<string | null>(null)

const tabs = computed(() => [
  {
    to: `/tenants/${tenantId}/user-settings/organization-units`,
    label: t('tenant.organizationUnits.title'),
  },
  {
    to: `/tenants/${tenantId}/user-settings/invitations`,
    label: t('tenant.invitations.title'),
  },
])

const refresh = async () => {
  try {
    loading.value = true
    error.value = null
    tenant.value = await tenantService.get(tenantId)
  } catch (err) {
    handleErrorWithToast(t('tenant.show.error'), err)
    error.value = 'Failed to load tenant'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await refresh()
})
</script>

<template>
  <AuthenticatedLayout>
    <EntityDetailsLayout
      v-if="tenant"
      :title="t('tenant.menuCategories.usersSettings')"
      :back-link="'/tenants'"
      :name="tenant.name"
      :logo="tenant.logoUrl"
      :loading
      :show-sidebar="false"
      @refresh="refresh"
    >
      <template #back-link-text>
        {{ t('tenant.title') }}
      </template>

      <template #tabs>
        <TabLink
          v-for="tab in tabs"
          :key="tab.to"
          :to="tab.to"
          :label="tab.label"
        />
      </template>

      <template #content>
        <RouterView v-if="tenant" :tenant />
      </template>
    </EntityDetailsLayout>
  </AuthenticatedLayout>
</template>
