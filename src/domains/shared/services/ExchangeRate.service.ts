import api from '@/lib/api'
import type { IGenericFilters } from '../helpers/filtering'
import type { IExchangeRate } from '../types/exchange-rate.type'
import type { IResource, IResourceCollection } from '../types/resource.type'
import { buildSpatieQuery } from '../helpers/filtering'

class ExchangeRateService {
  private readonly baseUrl = '/exchange-rates'

  async index(filters?: IGenericFilters): Promise<IResourceCollection<IExchangeRate>> {
    const params = buildSpatieQuery(filters ?? { filter: {} })

    const response = await api.get<IResourceCollection<IExchangeRate>>(this.baseUrl, { params })
    return response.data
  }

  async show(id: string): Promise<IExchangeRate> {
    const response = await api.get<IResource<IExchangeRate>>(`${this.baseUrl}/${id}`)
    return response.data.data
  }
}

export const exchangeRateService = new ExchangeRateService()
