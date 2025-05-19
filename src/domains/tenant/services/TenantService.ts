import { useAuthStore } from '@/domains/auth/store/auth.store'
import api from '@/lib/api'
import { apiRoutes } from '@/lib/api/apiRoutes'
import type { ITenant, ITenantPreview } from '@/domains/tenant/types/tenant.type'

class TenantService {
  async index(): Promise<ITenantPreview[]> {
    const response = await api.get<{ data: ITenantPreview[] }>(apiRoutes.tenants())
    return response.data.data
  }

  async get(id: string): Promise<ITenant> {
    const response = await api.get<{ data: ITenantPreview[] }>(`${apiRoutes.tenants()}/${id}`)
    return response.data.data
  }

  async switch(id: string): Promise<void> {
    const authStore = useAuthStore()
    const { accessToken } = (await api.post(apiRoutes.tenantsSwitch(id))).data
    authStore.setToken(accessToken)
  }
}

export const tenantService = new TenantService()
