import api from '@/lib/api'
import { apiRoutesMap } from '@/lib/api/apiRoutes'
import type { IComment, ICommentCreate, ICommentService } from '@/domains/comment/types/comment.type'
import type { IResourceCollection } from '@/domains/shared/types/resource.type'

class ProjectCommentsService implements ICommentService {
  async index(projectId: string, page = 1, perPage = 10): Promise<IResourceCollection<IComment>> {
    const response = (await api.get<IResourceCollection<IComment>>(`${apiRoutesMap.projects}/${projectId}/comments`, {
      params: { page, perPage },
    })).data
    return response
  }

  async create(projectId: string, content: string): Promise<IComment> {
    const response = (await api.post<{ data: IComment }>(`${apiRoutesMap.projects}/${projectId}/comments`, { content })).data
    return response.data
  }

  async update(projectId: string, id: string, comment: Partial<ICommentCreate>): Promise<IComment> {
    const response = (await api.patch<{ data: IComment }>(`${apiRoutesMap.projects}/${projectId}/comments/${id}`, comment)).data
    return response.data
  }

  async delete(projectId: string, id: string): Promise<void> {
    await api.delete(`${apiRoutesMap.projects}/${projectId}/comments/${id}`)
  }
}

export const projectCommentsService = new ProjectCommentsService()
