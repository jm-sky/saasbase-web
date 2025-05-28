import api from '@/lib/api'
import { apiRoutesMap } from '@/lib/api/apiRoutes'
import type { ITenantPublicProfile, ITenantPublicProfileCreate } from '@/domains/tenant/types/tenant.type'

class TenantPublicProfileService {
  async show(tenantId: string): Promise<ITenantPublicProfile> {
    const response = (await api.get<{ data: ITenantPublicProfile }>(`${apiRoutesMap.tenants}/${tenantId}/public-profile`)).data
    return response.data
  }

  async update(tenantId: string, publicProfile: Partial<ITenantPublicProfileCreate>): Promise<ITenantPublicProfile> {
    const response = (await api.put<{ data: ITenantPublicProfile }>(`${apiRoutesMap.tenants}/${tenantId}/public-profile`, publicProfile)).data
    return response.data
  }

  async deleteMedia(tenantId: string, collection: string): Promise<void> {
    await api.delete(`${apiRoutesMap.tenants}/${tenantId}/public-profile/${collection}`)
  }
}

export const tenantPublicProfileService = new TenantPublicProfileService()
