<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import AvatarUploader from '@/components/Inputs/AvatarUploader.vue'
import EntityDetailsLayout from '@/components/layouts/EntityDetailsLayout.vue'
import InfoSection from '@/components/Sections/InfoSection.vue'
import Separator from '@/components/ui/separator/Separator.vue'
import { tenantLogoService } from '@/domains/tenant/services/TenantLogoService'
import { tenantService } from '@/domains/tenant/services/TenantService'
import { useTenantStore } from '@/domains/tenant/store/tenant.store'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { toDateTimeString } from '@/lib/toDateTimeString'

const { t } = useI18n()
const route = useRoute()
const tenantStore = useTenantStore()
const tenantId = route.params.id as string

const { tenant } = storeToRefs(tenantStore)

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
          {{ $t('tenant.overview.title') }}
        </RouterLink>
        <RouterLink
          :to="`/tenants/${tenantId}/show/logs`"
          class="border-b-2 border-transparent hover:border-muted-foreground px-2 py-1"
          exact-active-class="text-primary border-primary!"
        >
          {{ $t('tenant.logs.title') }}
        </RouterLink>
        <RouterLink
          :to="`/tenants/${tenantId}/show/invitations`"
          class="border-b-2 border-transparent hover:border-muted-foreground px-2 py-1"
          exact-active-class="text-primary border-primary!"
        >
          {{ $t('tenant.invitations.title') }}
        </RouterLink>
        <RouterLink
          :to="`/tenants/${tenantId}/show/branding`"
          class="border-b-2 border-transparent hover:border-muted-foreground px-2 py-1"
          exact-active-class="text-primary border-primary!"
        >
          {{ $t('tenant.branding.title') }}
        </RouterLink>
        <RouterLink
          :to="`/tenants/${tenantId}/show/public-profile`"
          class="border-b-2 border-transparent hover:border-muted-foreground px-2 py-1"
          exact-active-class="text-primary border-primary!"
        >
          {{ $t('tenant.publicProfile.title') }}
        </RouterLink>
        <RouterLink
          :to="`/tenants/${tenantId}/show/billing`"
          class="border-b-2 border-transparent hover:border-muted-foreground px-2 py-1"
          active-class="text-primary border-primary!"
        >
          {{ $t('tenant.billing.title') }}
        </RouterLink>
        <RouterLink
          :to="`/tenants/${tenantId}/show/integrations`"
          class="border-b-2 border-transparent hover:border-muted-foreground px-2 py-1"
          exact-active-class="text-primary border-primary!"
        >
          {{ $t('tenant.integrations.title') }}
        </RouterLink>
        <RouterLink
          :to="`/tenants/${tenantId}/show/settings`"
          class="border-b-2 border-transparent hover:border-muted-foreground px-2 py-1"
          exact-active-class="text-primary border-primary!"
        >
          {{ $t('tenant.settings.title') }}
        </RouterLink>
      </template>

      <template #content>
        <RouterView v-if="tenant" :tenant />
      </template>
    </EntityDetailsLayout>
  </AuthenticatedLayout>
</template>
