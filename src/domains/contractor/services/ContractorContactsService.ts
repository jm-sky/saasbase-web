import api from '@/lib/api'
import { apiRoutesMap } from '@/lib/api/apiRoutes'
import type { IContractorContact, IContractorContactCreate } from '@/domains/contractor/types/contractor.type'
import type { IResourceCollection } from '@/domains/shared/types/resource.type'

class ContractorContactsService {
  async index(contractorId: string): Promise<IResourceCollection<IContractorContact>> {
    const response = (await api.get<IResourceCollection<IContractorContact>>(`${apiRoutesMap.contractors}/${contractorId}/contacts`)).data
    return response
  }

  async get(contractorId: string, id: string): Promise<IContractorContact> {
    const response = (await api.get<{ data: IContractorContact }>(`${apiRoutesMap.contractors}/${contractorId}/contacts/${id}`)).data
    return response.data
  }

  async create(contractorId: string, contact: IContractorContactCreate): Promise<IContractorContact> {
    const response = (await api.post<{ data: IContractorContact }>(`${apiRoutesMap.contractors}/${contractorId}/contacts`, contact)).data
    return response.data
  }

  async update(contractorId: string, id: string, contact: Partial<IContractorContactCreate>): Promise<IContractorContact> {
    const response = (await api.patch<{ data: IContractorContact }>(`${apiRoutesMap.contractors}/${contractorId}/contacts/${id}`, contact)).data
    return response.data
  }

  async delete(contractorId: string, id: string): Promise<void> {
    await api.delete(`${apiRoutesMap.contractors}/${contractorId}/contacts/${id}`)
  }
}

export const contractorContactsService = new ContractorContactsService()
