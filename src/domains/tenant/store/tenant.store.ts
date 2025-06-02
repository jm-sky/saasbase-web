import { StorageSerializers, useSessionStorage } from '@vueuse/core'
import { defineStore, storeToRefs } from 'pinia'
import { watch } from 'vue'
import { config } from '@/config'
import { useAuthStore } from '@/domains/auth/store/auth.store'
import type { ITenant, ITenantAddress, ITenantBranding, ITenantPublicProfile } from '../types/tenant.type'

export const useTenantStore = defineStore('tenant', () => {
  const authStore = useAuthStore()
  const { tenantId } = storeToRefs(authStore)

  const tenant = useSessionStorage<ITenant | null>(`${config.appId}:tenant`, null, { serializer: StorageSerializers.object })
  const tenantBranding = useSessionStorage<ITenantBranding | null>(`${config.appId}:tenantBranding`, null, { serializer: StorageSerializers.object })
  const tenantPublicProfile = useSessionStorage<ITenantPublicProfile | null>(`${config.appId}:tenantPublicProfile`, null, { serializer: StorageSerializers.object })
  const tenantBillingAddress = useSessionStorage<ITenantAddress | null>(`${config.appId}:tenantBillingAddress`, null, { serializer: StorageSerializers.object })

  watch(tenantId, () => {
    if (tenant.value && tenantId.value && tenant.value.id !== tenantId.value) {
      tenant.value = null
      tenantBranding.value = null
      tenantPublicProfile.value = null
    }
  }, {
    immediate: true,
    flush: 'pre',
  })

  return {
    tenant,
    tenantId,
    tenantBranding,
    tenantPublicProfile,
    tenantBillingAddress,
  }
})
