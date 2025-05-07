import { Contractor, type IContractor } from '@/domains/contractor/models/contractor.model'
import api from '@/lib/api'
import { apiRoutesMap } from '@/lib/api/apiRoutes'

export interface IContractorGetParams {
  isSupplier?: boolean
  isBuyer?: boolean
  limit?: number
  offset?: number
}

class ContractorService {
  async index(params?: IContractorGetParams): Promise<Contractor[]> {
    const response = await api.get<{ data: IContractor[] }>(apiRoutesMap.contractors, { params })
    return response.data.data.map(data => Contractor.load(data))
  }

  async get(id: string): Promise<Contractor> {
    const response = await api.get<{ data: IContractor }>(`${apiRoutesMap.contractors}/${id}`)
    return Contractor.load(response.data.data)
  }

  async create(contractor: Omit<IContractor, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contractor> {
    const response = await api.post<{ data: IContractor }>(apiRoutesMap.contractors, contractor)
    return Contractor.load(response.data.data)
  }

  async update(id: string, contractor: Partial<IContractor>): Promise<Contractor> {
    const response = await api.patch<{ data: IContractor }>(`${apiRoutesMap.contractors}/${id}`, contractor)
    return Contractor.load(response.data.data)
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${apiRoutesMap.contractors}/${id}`)
  }
}

export const contractorService = new ContractorService()
