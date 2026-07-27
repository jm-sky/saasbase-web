import api from '@/lib/api'
import type { IAllocationDimensionData } from '../types/expenseDimension.type'

class ExpenseDimensionService {
  async getAvailableDimensions(): Promise<IAllocationDimensionData[]> {
    const response = await api.get<{
      data: { dimensions: IAllocationDimensionData[] }
    }>('/available-dimensions')
    return response.data.data.dimensions
  }
}

export const expenseDimensionService = new ExpenseDimensionService()
