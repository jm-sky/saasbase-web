import api from '@/lib/api'
import { apiRoutesMap } from '@/lib/api/apiRoutes'
import type { ITenantBranding } from '@/domains/tenant/types/tenant.type'

class TenantBrandingService {
  async show(tenantId: string): Promise<ITenantBranding> {
    const response = (await api.get<{ data: ITenantBranding }>(`${apiRoutesMap.tenants}/${tenantId}/branding`)).data
    return response.data
  }

  async update(tenantId: string, branding: Partial<ITenantBranding>): Promise<ITenantBranding> {
    const response = (await api.put<{ data: ITenantBranding }>(`${apiRoutesMap.tenants}/${tenantId}/branding`, branding)).data
    return response.data
  }

  async deleteMedia(tenantId: string, collection: string): Promise<void> {
    await api.delete(`${apiRoutesMap.tenants}/${tenantId}/branding/${collection}`)
  }
}

export const tenantBrandingService = new TenantBrandingService()
