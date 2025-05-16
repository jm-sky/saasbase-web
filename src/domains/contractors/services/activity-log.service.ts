import api from '@/lib/api'
import type { ContractorActivityLog } from '../types/activity-log'
import type { TUUID } from '@/domains/shared/types/common'

export class ContractorActivityLogService {
  static async getLogs(contractorId: TUUID): Promise<ContractorActivityLog[]> {
    const { data } = await api.get<ContractorActivityLog[]>(`/contractors/${contractorId}/activity-logs`)
    return data
  }
}
