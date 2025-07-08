import api from '@/lib/api'
import { apiRoutesMap } from '@/lib/api/apiRoutes'

class TenantBillingCustomerService {
  async create(tenantId: string, name: string, address: string): Promise<void> {
    await api.post(`${apiRoutesMap.tenants}/${tenantId}/billing-customer`, {
      name,
      address,
    })
  }

  async update(tenantId: string, name: string, address: string): Promise<void> {
    await api.put(`${apiRoutesMap.tenants}/${tenantId}/billing-customer`, {
      name,
      address,
    })
  }

  async delete(tenantId: string): Promise<void> {
    await api.delete(`${apiRoutesMap.tenants}/${tenantId}/billing-customer`)
  }
}

export const tenantBillingCustomerService = new TenantBillingCustomerService()