import api from '@/lib/api'
import type { ContractorActivityLog } from '../types/activity-log'
import type { TUUID } from '@/domains/shared/types/common'
import type { IResource } from '@/domains/shared/types/resource.type'

export class ContractorActivityLogService {
  static async getLogs(contractorId: TUUID): Promise<ContractorActivityLog[]> {
    const { data } = await api.get<IResource<ContractorActivityLog>>(`/contractors/${contractorId}/logs`)
    return data.data
  }
}
