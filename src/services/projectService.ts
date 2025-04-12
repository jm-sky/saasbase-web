import api from '@/helpers/api'
import { apiRoutesMap } from '@/helpers/api/apiRoutes'
import { type IProject, type TProjectStatus } from '@/models/project.model'

export interface IProjectGetParams {
  status?: TProjectStatus
  limit?: number
  offset?: number
}

class ProjectService {
  async index(params?: IProjectGetParams): Promise<IProject[]> {
    const response = await api.get<{ projects: IProject[] }>(apiRoutesMap.projects, { params })
    return response.data.projects
  }

  async get(id: string): Promise<IProject> {
    const response = await api.get<IProject>(`${apiRoutesMap.projects}/${id}`)
    return response.data
  }

  async create(project: Omit<IProject, 'id' | 'createdAt' | 'updatedAt'>): Promise<IProject> {
    const response = await api.post<IProject>(apiRoutesMap.projects, project)
    return response.data
  }

  async update(id: string, project: Partial<IProject>): Promise<IProject> {
    const response = await api.patch<IProject>(`${apiRoutesMap.projects}/${id}`, project)
    return response.data
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${apiRoutesMap.projects}/${id}`)
  }
}

export const projectService = new ProjectService()
