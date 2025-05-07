import { Comment, type IComment } from '@/domains/comment/models/comment.model'
import api from '@/lib/api'
import { apiRoutesMap } from '@/lib/api/apiRoutes'

export interface ICommentGetParams {
  commentableId?: string
  commentableType?: string
  limit?: number
  offset?: number
}

class CommentService {
  async index(params?: ICommentGetParams): Promise<Comment[]> {
    const response = await api.get<{ data: IComment[] }>(apiRoutesMap.comments, { params })
    return response.data.data.map(data => Comment.load(data))
  }

  async get(id: string): Promise<Comment> {
    const response = await api.get<{ data: IComment }>(`${apiRoutesMap.comments}/${id}`)
    return Comment.load(response.data.data)
  }

  async create(comment: Omit<IComment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Comment> {
    const response = await api.post<{ data: IComment }>(apiRoutesMap.comments, comment)
    return Comment.load(response.data.data)
  }

  async update(id: string, comment: Partial<IComment>): Promise<Comment> {
    const response = await api.patch<{ data: IComment }>(`${apiRoutesMap.comments}/${id}`, comment)
    return Comment.load(response.data.data)
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${apiRoutesMap.comments}/${id}`)
  }
}

export const commentService = new CommentService()
