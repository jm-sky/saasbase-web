import api from '@/lib/api'
import type { ProductActivityLog } from '../types/activity-log'
import type { TUUID } from '@/domains/shared/types/common'
import type { IResource } from '@/domains/shared/types/resource.type'

export class ProductActivityLogService {
  static async getLogs(productId: TUUID): Promise<ProductActivityLog[]> {
    const { data } = await api.get<IResource<ProductActivityLog>>(`/products/${productId}/logs`)
    return data.data
  }
}
