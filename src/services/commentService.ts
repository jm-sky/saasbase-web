import { Comment, type IComment } from '@/domains/comment/models/comment.model'
import api from '@/helpers/api'
import { apiRoutesMap } from '@/helpers/api/apiRoutes'

export interface ICommentGetParams {
  commentableId?: string
  commentableType?: string
  limit?: number
  offset?: number
}

class CommentService {
  async index(params?: ICommentGetParams): Promise<Comment[]> {
    const response = await api.get<{ comments: IComment[] }>(apiRoutesMap.comments, { params })
    return response.data.comments.map(data => Comment.load(data))
  }

  async get(id: string): Promise<Comment> {
    const response = await api.get<IComment>(`${apiRoutesMap.comments}/${id}`)
    return Comment.load(response.data)
  }

  async create(comment: Omit<IComment, 'id' | 'createdAt'>): Promise<Comment> {
    const response = await api.post<IComment>(apiRoutesMap.comments, comment)
    return Comment.load(response.data)
  }

  async update(id: string, comment: Partial<IComment>): Promise<Comment> {
    const response = await api.patch<IComment>(`${apiRoutesMap.comments}/${id}`, comment)
    return Comment.load(response.data)
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${apiRoutesMap.comments}/${id}`)
  }
}

export const commentService = new CommentService()
