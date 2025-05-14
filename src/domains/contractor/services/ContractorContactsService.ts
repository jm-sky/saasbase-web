import api from '@/lib/api'
import { apiRoutesMap } from '@/lib/api/apiRoutes'
import type { IContractorContactPerson, IContractorContactPersonCreate } from '@/domains/contractor/models/contractor.model'
import type { IResource } from '@/domains/shared/types/resource.type'

class ContractorContactsService {
  async index(contractorId: string): Promise<IResource<IContractorContactPerson>> {
    const response = (await api.get<IResource<IContractorContactPerson>>(`${apiRoutesMap.contractors}/${contractorId}/contacts`)).data
    return response
  }

  async get(contractorId: string, id: string): Promise<IContractorContactPerson> {
    const response = (await api.get<{ data: IContractorContactPerson }>(`${apiRoutesMap.contractors}/${contractorId}/contacts/${id}`)).data
    return response.data
  }

  async create(contractorId: string, contact: IContractorContactPersonCreate): Promise<IContractorContactPerson> {
    const response = (await api.post<{ data: IContractorContactPerson }>(`${apiRoutesMap.contractors}/${contractorId}/contacts`, contact)).data
    return response.data
  }

  async update(contractorId: string, id: string, contact: Partial<IContractorContactPersonCreate>): Promise<IContractorContactPerson> {
    const response = (await api.patch<{ data: IContractorContactPerson }>(`${apiRoutesMap.contractors}/${contractorId}/contacts/${id}`, contact)).data
    return response.data
  }

  async delete(contractorId: string, id: string): Promise<void> {
    await api.delete(`${apiRoutesMap.contractors}/${contractorId}/contacts/${id}`)
  }
}

export const contractorContactsService = new ContractorContactsService()
