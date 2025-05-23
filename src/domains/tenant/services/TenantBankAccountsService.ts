import api from '@/lib/api'
import { apiRoutesMap } from '@/lib/api/apiRoutes'
import type { IResourceCollection } from '@/domains/shared/types/resource.type'
import type { ITenantBankAccount, ITenantBankAccountCreate } from '@/domains/tenant/types/tenant.type'

class TenantBankAccountsService {
  async index(tenantId: string): Promise<IResourceCollection<ITenantBankAccount>> {
    const response = (await api.get<IResourceCollection<ITenantBankAccount>>(`${apiRoutesMap.tenants}/${tenantId}/bank-accounts`)).data
    return response
  }

  async get(tenantId: string, id: string): Promise<ITenantBankAccount> {
    const response = (await api.get<{ data: ITenantBankAccount }>(`${apiRoutesMap.tenants}/${tenantId}/bank-accounts/${id}`)).data
    return response.data
  }

  async create(tenantId: string, bankAccount: ITenantBankAccountCreate): Promise<ITenantBankAccount> {
    const response = (await api.post<{ data: ITenantBankAccount }>(`${apiRoutesMap.tenants}/${tenantId}/bank-accounts`, bankAccount)).data
    return response.data
  }

  async update(tenantId: string, id: string, bankAccount: Partial<ITenantBankAccountCreate>): Promise<ITenantBankAccount> {
    const response = (await api.patch<{ data: ITenantBankAccount }>(`${apiRoutesMap.tenants}/${tenantId}/bank-accounts/${id}`, bankAccount)).data
    return response.data
  }

  async delete(tenantId: string, id: string): Promise<void> {
    await api.delete(`${apiRoutesMap.tenants}/${tenantId}/bank-accounts/${id}`)
  }

  async setDefault(tenantId: string, id: string): Promise<void> {
    await api.post(`${apiRoutesMap.tenants}/${tenantId}/bank-accounts/${id}/set-default`)
  }
}

export const tenantBankAccountsService = new TenantBankAccountsService()
