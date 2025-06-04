import api from '@/lib/api'
import type { IResource } from '@/domains/shared/types/resource.type'
import type { ISubscriptionPlan } from '@/domains/subscription/types/subscription.type'

export interface ICurrentSubscriptionQuotas {
  storage: {
    used: number
    total: number
    unit: 'MB' | 'GB'
  }
  users: {
    used: number
    total: number
  }
  apiCalls: {
    used: number
    total: number
  }
}

class TenantSubscriptionService {
  async getCurrentPlan(tenantId: string): Promise<ISubscriptionPlan> {
    return (await api.get<IResource<ISubscriptionPlan>>(`/tenants/${tenantId}/current-plan`)).data.data
  }

  async getQuotas(tenantId: string): Promise<ICurrentSubscriptionQuotas> {
    return (await api.get<IResource<ICurrentSubscriptionQuotas>>(`/tenants/${tenantId}/quota`)).data.data
  }
}

export const tenantSubscriptionService = new TenantSubscriptionService()
