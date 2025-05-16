import api from '@/lib/api'
import type { TenantActivityLog } from '../types/activity-log'
import type { TUUID } from '@/domains/shared/types/common'

export class TenantActivityLogService {
  static async getLogs(tenantId: TUUID): Promise<TenantActivityLog[]> {
    const { data } = await api.get<TenantActivityLog[]>(`/tenants/${tenantId}/activity-logs`)
    return data
  }
}
