import api from '@/lib/api'
import type { ICurrency } from '../types/currency.type'
import type { IResourceCollection } from '../types/resource.type'

class CurrencyService {
  async index(): Promise<ICurrency[]> {
    const response = await api.get<IResourceCollection<ICurrency>>('/currencies')
    return response.data.data
  }
}

export const currencyService = new CurrencyService()