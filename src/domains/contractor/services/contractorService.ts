import { type IContractor } from '@/domains/contractor/models/contractor.model'
import api from '@/lib/api'
import { apiRoutesMap } from '@/lib/api/apiRoutes'
import type { IResource } from '@/domains/shared/types/resource.type'
export interface IContractorFilters {
  search?: string
  page?: number
  perPage?: number
  isSupplier?: boolean
  isBuyer?: boolean
}

class ContractorService {
  async index(params?: IContractorFilters): Promise<IResource<IContractor>> {
    const response = (await api.get<IResource<IContractor>>(apiRoutesMap.contractors, { params })).data
    return response
  }

  async get(id: string): Promise<IContractor> {
    const response = (await api.get<{ data: IContractor }>(`${apiRoutesMap.contractors}/${id}`)).data
    return response.data
  }

  async create(contractor: Omit<IContractor, 'id' | 'createdAt' | 'updatedAt'>): Promise<IContractor> {
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
