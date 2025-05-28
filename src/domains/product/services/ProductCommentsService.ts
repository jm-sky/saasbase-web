import api from '@/lib/api'
import { apiRoutesMap } from '@/lib/api/apiRoutes'
import type { IComment, ICommentCreate } from '@/domains/comment/models/comment.model'
import type { IResourceCollection } from '@/domains/shared/types/resource.type'

class ProductCommentsService {
  async index(productId: string, page = 1, perPage = 10): Promise<IResourceCollection<IComment>> {
    const response = (await api.get<IResourceCollection<IComment>>(`${apiRoutesMap.products}/${productId}/comments`, {
      params: { page, perPage },
    })).data
    return response
  }

  async create(productId: string, content: string): Promise<IComment> {
    const response = (await api.post<{ data: IComment }>(`${apiRoutesMap.products}/${productId}/comments`, { content })).data
    return response.data
  }

  async update(productId: string, id: string, comment: Partial<ICommentCreate>): Promise<IComment> {
    const response = (await api.patch<{ data: IComment }>(`${apiRoutesMap.products}/${productId}/comments/${id}`, comment)).data
    return response.data
  }

  async delete(productId: string, id: string): Promise<void> {
    await api.delete(`${apiRoutesMap.products}/${productId}/comments/${id}`)
  }
}

export const productCommentsService = new ProductCommentsService()
