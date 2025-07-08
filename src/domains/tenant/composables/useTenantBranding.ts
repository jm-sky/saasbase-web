import { storeToRefs } from 'pinia'
import { tenantBrandingService } from '../services/TenantBrandingService'
import { useTenantStore } from '../store/tenant.store'

export const useTenantBranding = () => {
  const tenantStore = useTenantStore()
  const { tenant, tenantBranding } = storeToRefs(tenantStore)

  const loadTenantBranding = async () => {
    tenantBranding.value = await tenantBrandingService.show(tenantStore.tenantId ?? '')
  }

  return {
    tenantId: tenantStore.tenantId,
    tenant,
    tenantBranding,
    loadTenantBranding,
  }
}