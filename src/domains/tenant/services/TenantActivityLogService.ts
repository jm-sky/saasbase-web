import api from '@/lib/api'
import type { TenantActivityLog } from '../types/activity-log'
import type { TUUID } from '@/domains/shared/types/common'
import type { IResource } from '@/domains/shared/types/resource.type'

export class TenantActivityLogService {
  static async getLogs(tenantId: TUUID): Promise<TenantActivityLog[]> {
    const { data } = await api.get<IResource<TenantActivityLog>>(`/tenants/${tenantId}/logs`)
    return data.data
  }
}
