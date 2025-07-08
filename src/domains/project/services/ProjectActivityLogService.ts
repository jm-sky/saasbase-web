import api from '@/lib/api'
import type { ProjectActivityLog } from '../types/activity-log'
import type { TUUID } from '@/domains/shared/types/common'
import type { IResourceCollection } from '@/domains/shared/types/resource.type'

export class ProjectActivityLogService {
  static async getLogs(projectId: TUUID): Promise<ProjectActivityLog[]> {
    const { data } = await api.get<IResourceCollection<ProjectActivityLog>>(`/projects/${projectId}/logs`)
    return data.data
  }
}
