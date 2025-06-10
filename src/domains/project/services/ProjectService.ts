import api from '@/lib/api'
import { apiRoutesMap } from '@/lib/api/apiRoutes'
import type { IProject } from '@/domains/project/types/project.type'
import type { TProjectStatus } from '@/domains/project/types/project.type'
import type { IResource, IResourceCollection } from '@/domains/shared/types/resource.type'

export interface IProjectGetParams {
  status?: TProjectStatus
  limit?: number
  offset?: number
}

class ProjectService {
  async index(params?: IProjectGetParams): Promise<IResourceCollection<IProject>> {
    const response = await api.get<IResourceCollection<IProject>>(apiRoutesMap.projects, { params })
    return response.data
  }

  async get(id: string): Promise<IProject> {
    const response = await api.get<IResource<IProject>>(`${apiRoutesMap.projects}/${id}`)
    return response.data.data
  }

  async create(project: Omit<IProject, 'id' | 'createdAt' | 'updatedAt'>): Promise<IProject> {
    const response = await api.post<IResource<IProject>>(apiRoutesMap.projects, project)
    return response.data.data
  }

  async update(id: string, project: Partial<IProject>): Promise<IProject> {
    const response = await api.patch<IResource<IProject>>(`${apiRoutesMap.projects}/${id}`, project)
    return response.data.data
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${apiRoutesMap.projects}/${id}`)
  }
}

export const projectService = new ProjectService()
