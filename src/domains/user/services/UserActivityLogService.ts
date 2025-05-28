import api from '@/lib/api'
import type { UserActivityLog } from '../types/userActivityLog.type'
import type { IResourceCollection } from '@/domains/shared/types/resource.type'

export class UserActivityLogService {
  static async getLogs(): Promise<UserActivityLog[]> {
    const { data } = await api.get<IResourceCollection<UserActivityLog>>('/me/logs')
    return data.data
  }
}
