import api from '@/lib/api'
import { apiRoutesMap } from '@/lib/api/apiRoutes'
import type { IResourceCollection } from '@/domains/shared/types/resource.type'
import type { ITenantAddress, ITenantAddressCreate } from '@/domains/tenant/types/tenant.type'

class TenantAddressesService {
  async index(tenantId: string): Promise<IResourceCollection<ITenantAddress>> {
    const response = (await api.get<IResourceCollection<ITenantAddress>>(`${apiRoutesMap.tenants}/${tenantId}/addresses`)).data
    return response
  }

  async get(tenantId: string, id: string): Promise<ITenantAddress> {
    const response = (await api.get<{ data: ITenantAddress }>(`${apiRoutesMap.tenants}/${tenantId}/addresses/${id}`)).data
    return response.data
  }

  async create(tenantId: string, address: ITenantAddressCreate): Promise<ITenantAddress> {
    const response = (await api.post<{ data: ITenantAddress }>(`${apiRoutesMap.tenants}/${tenantId}/addresses`, address)).data
    return response.data
  }

  async update(tenantId: string, id: string, address: Partial<ITenantAddressCreate>): Promise<ITenantAddress> {
    const response = (await api.patch<{ data: ITenantAddress }>(`${apiRoutesMap.tenants}/${tenantId}/addresses/${id}`, address)).data
    return response.data
  }

  async delete(tenantId: string, id: string): Promise<void> {
    await api.delete(`${apiRoutesMap.tenants}/${tenantId}/addresses/${id}`)
  }

  async setDefault(tenantId: string, id: string): Promise<void> {
    await api.post(`${apiRoutesMap.tenants}/${tenantId}/addresses/${id}/set-default`)
  }
}

export const tenantAddressesService = new TenantAddressesService()
