import api from '@/helpers/api'
import { apiRoutesMap } from '@/helpers/api/apiRoutes'
import { type IComment } from '@/models/comment.model'

export interface ICommentGetParams {
  commentableId?: string
  commentableType?: string
  limit?: number
  offset?: number
}

class CommentService {
  async index(params?: ICommentGetParams): Promise<IComment[]> {
    const response = await api.get<{ comments: IComment[] }>(apiRoutesMap.comments, { params })
    return response.data.comments
  }

  async get(id: string): Promise<IComment> {
    const response = await api.get<IComment>(`${apiRoutesMap.comments}/${id}`)
    return response.data
  }

  async create(comment: Omit<IComment, 'id' | 'createdAt'>): Promise<IComment> {
    const response = await api.post<IComment>(apiRoutesMap.comments, comment)
    return response.data
  }

  async update(id: string, comment: Partial<IComment>): Promise<IComment> {
    const response = await api.patch<IComment>(`${apiRoutesMap.comments}/${id}`, comment)
    return response.data
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${apiRoutesMap.comments}/${id}`)
  }
}

export const commentService = new CommentService()
