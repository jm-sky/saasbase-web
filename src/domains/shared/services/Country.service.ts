import api from '@/lib/api'
import type { IGenericFilters } from '../helpers/filtering'
import type { ICountry } from '../types/country.type'
import type { IResourceCollection } from '../types/resource.type'
import { buildSpatieQuery } from '../helpers/filtering'

export interface ICountryFilters extends IGenericFilters {
  search?: string
}

class CountryService {
  private readonly baseUrl = '/countries'

  async index(filters?: ICountryFilters): Promise<IResourceCollection<ICountry>> {
    const params = buildSpatieQuery(filters ?? { filter: {} })

    const response = await api.get<IResourceCollection<ICountry>>(this.baseUrl, { params })
    return response.data
  }
}

export const countryService = new CountryService()
