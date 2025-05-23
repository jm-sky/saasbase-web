import api from '@/lib/api'
import type { TenantActivityLog } from '../types/activity-log'
import type { TUUID } from '@/domains/shared/types/common'
import type { IResourceCollection } from '@/domains/shared/types/resource.type'

export class TenantActivityLogService {
  static async getLogs(tenantId: TUUID): Promise<TenantActivityLog[]> {
    const { data } = await api.get<IResourceCollection<TenantActivityLog>>(`/tenants/${tenantId}/logs`)
    return data.data
  }
}
