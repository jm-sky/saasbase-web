import api from '@/lib/api'
import type { IPositionCategory } from '@/domains/rights/types/position.type'
import type { IResourceCollection } from '@/domains/shared/types/resource.type'

class PositionCategoryService {
  async list(): Promise<IPositionCategory[]> {
    const response = await api.get<IResourceCollection<IPositionCategory>>('/position-categories')
    return response.data.data
  }
}

export const positionCategoryService = new PositionCategoryService()
