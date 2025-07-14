import { StorageSerializers, useSessionStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { config } from '@/config'
import type { ITenantPreview } from '../types/tenant.type'

export const useTenantsStore = defineStore('tenants', () => {
  const tenants = useSessionStorage<ITenantPreview[]>(`${config.appId}:tenants`, [], { serializer: StorageSerializers.object })

  return {
    tenants,
  }
})
