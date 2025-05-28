import { useAuthStore } from '@/domains/auth/store/auth.store'
import api from '@/lib/api'
import { apiRoutes } from '@/lib/api/apiRoutes'
import type { IResource, IResourceCollection } from '@/domains/shared/types/resource.type'
import type { ITenant, ITenantCreate, ITenantPreview } from '@/domains/tenant/types/tenant.type'

class TenantService {
  async preview(): Promise<ITenantPreview[]> {
    const response = await api.get<IResourceCollection<ITenantPreview>>(apiRoutes.tenantsPreview())
    return response.data.data
  }

  async index(): Promise<ITenant[]> {
    const response = await api.get<IResourceCollection<ITenant>>(apiRoutes.tenants())
    return response.data.data
  }

  async get(id: string): Promise<ITenant> {
    const response = await api.get<IResource<ITenant>>(`${apiRoutes.tenants()}/${id}`)
    return response.data.data
  }

  async create(data: ITenantCreate): Promise<void> {
    await api.post(apiRoutes.tenants(), data)
  }

  async switch(id: string): Promise<void> {
    const authStore = useAuthStore()
    const { accessToken } = (await api.post(apiRoutes.tenantsSwitch(id))).data
    authStore.setToken(accessToken)
  }
}

export const tenantService = new TenantService()
