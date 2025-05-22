import api from '@/lib/api'
import { apiRoutesMap } from '@/lib/api/apiRoutes'
import type { IContractorBankAccount, IContractorBankAccountCreate } from '@/domains/contractor/models/contractor.model'
import type { IResource } from '@/domains/shared/types/resource.type'

class ContractorBankAccountsService {
  async index(contractorId: string): Promise<IResource<IContractorBankAccount>> {
    const response = (await api.get<IResource<IContractorBankAccount>>(`${apiRoutesMap.contractors}/${contractorId}/bank-accounts`)).data
    return response
  }

  async get(contractorId: string, id: string): Promise<IContractorBankAccount> {
    const response = (await api.get<{ data: IContractorBankAccount }>(`${apiRoutesMap.contractors}/${contractorId}/bank-accounts/${id}`)).data
    return response.data
  }

  async create(contractorId: string, bankAccount: IContractorBankAccountCreate): Promise<IContractorBankAccount> {
    const response = (await api.post<{ data: IContractorBankAccount }>(`${apiRoutesMap.contractors}/${contractorId}/bank-accounts`, bankAccount)).data
    return response.data
  }

  async update(contractorId: string, id: string, bankAccount: Partial<IContractorBankAccountCreate>): Promise<IContractorBankAccount> {
    const response = (await api.patch<{ data: IContractorBankAccount }>(`${apiRoutesMap.contractors}/${contractorId}/bank-accounts/${id}`, bankAccount)).data
    return response.data
  }

  async delete(contractorId: string, id: string): Promise<void> {
    await api.delete(`${apiRoutesMap.contractors}/${contractorId}/bank-accounts/${id}`)
  }

  async setDefault(contractorId: string, id: string): Promise<void> {
    await api.post(`${apiRoutesMap.contractors}/${contractorId}/bank-accounts/${id}/set-default`)
  }
}

export const contractorBankAccountsService = new ContractorBankAccountsService()
