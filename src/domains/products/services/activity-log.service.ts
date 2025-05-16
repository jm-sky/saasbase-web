import api from '@/lib/api'
import type { ProductActivityLog } from '../types/activity-log'
import type { TUUID } from '@/domains/shared/types/common'

export class ProductActivityLogService {
  static async getLogs(productId: TUUID): Promise<ProductActivityLog[]> {
    const { data } = await api.get<ProductActivityLog[]>(`/products/${productId}/activity-logs`)
    return data
  }
}
