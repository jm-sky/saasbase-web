import { type IContractor, type IContractorCombinedCreate } from '@/domains/contractor/types/contractor.type'
import { buildSpatieQuery } from '@/domains/shared/helpers/filtering'
import api from '@/lib/api'
import { apiRoutesMap } from '@/lib/api/apiRoutes'
import type { SortingState } from '@tanstack/vue-table'
import type { FilterDefinition, IResourceCollection } from '@/domains/shared/types/resource.type'

export interface IContractorFilters {
  search?: string
  page?: number
  perPage?: number
  filter?: Record<string, FilterDefinition>
  sort?: SortingState
}

class ContractorService {
  async index(filters?: IContractorFilters): Promise<IResourceCollection<IContractor>> {
    const params = buildSpatieQuery(filters ?? { filter: {} })
    const response = (await api.get<IResourceCollection<IContractor>>(apiRoutesMap.contractors, { params })).data
    return response
  }

  async get(id: string): Promise<IContractor> {
    const response = (await api.get<{ data: IContractor }>(`${apiRoutesMap.contractors}/${id}`)).data
    return response.data
  }

  async create(contractor: IContractorCombinedCreate): Promise<IContractor> {
    const response = (await api.post<{ data: IContractor }>(apiRoutesMap.contractors, contractor)).data
    return response.data
  }

  async update(id: string, contractor: Partial<IContractor>): Promise<IContractor> {
    const response = (await api.patch<{ data: IContractor }>(`${apiRoutesMap.contractors}/${id}`, contractor)).data
    return response.data
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${apiRoutesMap.contractors}/${id}`)
  }
}

export const contractorService = new ContractorService()
