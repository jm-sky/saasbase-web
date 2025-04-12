import api from '@/helpers/api'
import { apiRoutesMap } from '@/helpers/api/apiRoutes'
import { type IContractor } from '@/models/contractor.model'

export interface IContractorGetParams {
  isSupplier?: boolean
  isBuyer?: boolean
  limit?: number
  offset?: number
}

class ContractorService {
  async index(params?: IContractorGetParams): Promise<IContractor[]> {
    const response = await api.get<{ contractors: IContractor[] }>(apiRoutesMap.contractors, { params })
    return response.data.contractors
  }

  async get(id: string): Promise<IContractor> {
    const response = await api.get<IContractor>(`${apiRoutesMap.contractors}/${id}`)
    return response.data
  }

  async create(contractor: Omit<IContractor, 'id' | 'createdAt' | 'updatedAt'>): Promise<IContractor> {
    const response = await api.post<IContractor>(apiRoutesMap.contractors, contractor)
    return response.data
  }

  async update(id: string, contractor: Partial<IContractor>): Promise<IContractor> {
    const response = await api.patch<IContractor>(`${apiRoutesMap.contractors}/${id}`, contractor)
    return response.data
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${apiRoutesMap.contractors}/${id}`)
  }
}

export const contractorService = new ContractorService()
