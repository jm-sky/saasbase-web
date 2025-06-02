import api from '@/lib/api'
import { apiRoutesMap } from '@/lib/api/apiRoutes'
import type { IComment, ICommentCreate } from '@/domains/comment/types/comment.type'
import type { IResourceCollection } from '@/domains/shared/types/resource.type'

class ContractorCommentsService {
  async index(contractorId: string, page = 1, perPage = 10): Promise<IResourceCollection<IComment>> {
    const response = (await api.get<IResourceCollection<IComment>>(`${apiRoutesMap.contractors}/${contractorId}/comments`, {
      params: { page, perPage },
    })).data
    return response
  }

  async create(contractorId: string, content: string): Promise<IComment> {
    const response = (await api.post<{ data: IComment }>(`${apiRoutesMap.contractors}/${contractorId}/comments`, { content })).data
    return response.data
  }

  async update(contractorId: string, id: string, comment: Partial<ICommentCreate>): Promise<IComment> {
    const response = (await api.patch<{ data: IComment }>(`${apiRoutesMap.contractors}/${contractorId}/comments/${id}`, comment)).data
    return response.data
  }

  async delete(contractorId: string, id: string): Promise<void> {
    await api.delete(`${apiRoutesMap.contractors}/${contractorId}/comments/${id}`)
  }
}

export const contractorCommentsService = new ContractorCommentsService()
