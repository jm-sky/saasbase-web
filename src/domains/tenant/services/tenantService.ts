import api from '@/helpers/api'
import { apiRoutesMap } from '@/helpers/api/apiRoutes'
import type { ITenant } from '@/domains/tenant/types/tenant.type'

class TenantService {
  async index(): Promise<ITenant[]> {
    const response = await api.get<{ data: ITenant[] }>(apiRoutesMap.products)
    return response.data.data
  }

  async get(id: string): Promise<ITenant> {
    const response = await api.get<ITenant>(`${apiRoutesMap.products}/${id}`)
    return response.data
  }
}

export const tenantService = new TenantService()
