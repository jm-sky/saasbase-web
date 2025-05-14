import api from '@/lib/api'
import { apiRoutesMap } from '@/lib/api/apiRoutes'
import type { IResource } from '@/domains/shared/types/resource.type'

export interface IContractorComment {
  id: string
  contractorId: string
  content: string
  createdAt: string
  updatedAt: string
  createdBy: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
}

export type IContractorCommentCreate = Omit<IContractorComment, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>

class ContractorCommentsService {
  async index(contractorId: string, page = 1, perPage = 10): Promise<IResource<IContractorComment>> {
    const response = (await api.get<IResource<IContractorComment>>(`${apiRoutesMap.contractors}/${contractorId}/comments`, {
      params: { page, perPage },
    })).data
    return response
  }

  async create(contractorId: string, comment: IContractorCommentCreate): Promise<IContractorComment> {
    const response = (await api.post<{ data: IContractorComment }>(`${apiRoutesMap.contractors}/${contractorId}/comments`, comment)).data
    return response.data
  }

  async update(contractorId: string, id: string, comment: Partial<IContractorCommentCreate>): Promise<IContractorComment> {
    const response = (await api.patch<{ data: IContractorComment }>(`${apiRoutesMap.contractors}/${contractorId}/comments/${id}`, comment)).data
    return response.data
  }

  async delete(contractorId: string, id: string): Promise<void> {
    await api.delete(`${apiRoutesMap.contractors}/${contractorId}/comments/${id}`)
  }
}

export const contractorCommentsService = new ContractorCommentsService()
