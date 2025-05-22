import api from '@/lib/api'
import { apiRoutesMap } from '@/lib/api/apiRoutes'
import type { IContractorAddress, IContractorAddressCreate } from '@/domains/contractor/models/contractor.model'
import type { IResource } from '@/domains/shared/types/resource.type'

class ContractorAddressesService {
  async index(contractorId: string): Promise<IResource<IContractorAddress>> {
    const response = (await api.get<IResource<IContractorAddress>>(`${apiRoutesMap.contractors}/${contractorId}/addresses`)).data
    return response
  }

  async get(contractorId: string, id: string): Promise<IContractorAddress> {
    const response = (await api.get<{ data: IContractorAddress }>(`${apiRoutesMap.contractors}/${contractorId}/addresses/${id}`)).data
    return response.data
  }

  async create(contractorId: string, address: IContractorAddressCreate): Promise<IContractorAddress> {
    const response = (await api.post<{ data: IContractorAddress }>(`${apiRoutesMap.contractors}/${contractorId}/addresses`, address)).data
    return response.data
  }

  async update(contractorId: string, id: string, address: Partial<IContractorAddressCreate>): Promise<IContractorAddress> {
    const response = (await api.patch<{ data: IContractorAddress }>(`${apiRoutesMap.contractors}/${contractorId}/addresses/${id}`, address)).data
    return response.data
  }

  async delete(contractorId: string, id: string): Promise<void> {
    await api.delete(`${apiRoutesMap.contractors}/${contractorId}/addresses/${id}`)
  }

  async setDefault(contractorId: string, id: string): Promise<void> {
    await api.post(`${apiRoutesMap.contractors}/${contractorId}/addresses/${id}/set-default`)
  }
}

export const contractorAddressesService = new ContractorAddressesService()
