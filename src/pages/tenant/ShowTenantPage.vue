<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import AvatarUploader from '@/components/Inputs/AvatarUploader.vue'
import EntityDetailsLayout from '@/components/layouts/EntityDetailsLayout.vue'
import InfoSection from '@/components/Sections/InfoSection.vue'
import Separator from '@/components/ui/separator/Separator.vue'
import { tenantLogoService } from '@/domains/tenant/services/TenantLogoService'
import { tenantService } from '@/domains/tenant/services/TenantService'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { toDateTimeString } from '@/lib/toDateTimeString'
import type { ITenant } from '@/domains/tenant/types/tenant.type'

const { t } = useI18n()
const route = useRoute()
const tenantId = route.params.id as string

const tenant = ref<ITenant>()
const loading = ref(false)
const error = ref<string | null>(null)

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
      :title="t('tenant.tenantDetails')"
      :back-link="'/tenants'"
      :name="tenant.name"
      :logo="tenant.logoUrl"
      :loading
      @refresh="refresh"
    >
      <template #back-link-text>
        {{ t('tenant.title') }}
      </template>

      <template #sidebar>
        <AvatarUploader
          :model-id="tenantId"
          :avatar-url="tenant.logoUrl"
          :uploader-service="tenantLogoService"
          auto-upload
          size="lg"
          @uploaded="refresh"
          @removed="refresh"
        />

        <div class="font-bold">
          {{ tenant.name ?? '...' }}
        </div>

        <Separator class="my-2" />

        <div class="flex flex-col gap-3 text-left">
          <InfoSection :label="t('tenant.fields.description')" :value="tenant.description" />
          <InfoSection :label="t('tenant.fields.email')" :value="tenant.email" />
          <InfoSection :label="t('tenant.fields.phone')" :value="tenant.phone" />
          <InfoSection :label="t('tenant.fields.website')" :value="tenant.website" />
          <InfoSection :label="t('tenant.fields.country')" :value="tenant.country" />
          <InfoSection :label="t('tenant.fields.vatId')" :value="tenant.vatId" />
          <InfoSection :label="t('tenant.fields.taxId')" :value="tenant.taxId" />
          <InfoSection :label="t('tenant.fields.regon')" :value="tenant.regon" />
          <InfoSection :label="t('tenant.fields.createdAt')" :value="toDateTimeString(tenant.createdAt)" />
          <InfoSection :label="t('tenant.fields.updatedAt')" :value="toDateTimeString(tenant.updatedAt)" />
        </div>
      </template>

      <template #tabs>
        <RouterLink
          :to="`/tenants/${tenantId}/show/overview`"
          class="border-b-2 border-transparent hover:border-muted-foreground px-2 py-1"
          exact-active-class="text-primary border-primary!"
        >
          Overview
        </RouterLink>
        <RouterLink
          :to="`/tenants/${tenantId}/show/logs`"
          class="border-b-2 border-transparent hover:border-muted-foreground px-2 py-1"
          exact-active-class="text-primary border-primary!"
        >
          Logs
        </RouterLink>
        <RouterLink
          :to="`/tenants/${tenantId}/show/invitations`"
          class="border-b-2 border-transparent hover:border-muted-foreground px-2 py-1"
          exact-active-class="text-primary border-primary!"
        >
          Invitations
        </RouterLink>
      </template>

      <template #content>
        <RouterView v-if="tenant" :tenant />
      </template>
    </EntityDetailsLayout>
  </AuthenticatedLayout>
</template>
