import { Project } from '@/domains/project/models/project.model'
import api from '@/lib/api'
import { apiRoutesMap } from '@/lib/api/apiRoutes'
import { type TProjectStatus } from '@/types/index'
import type { IProject } from '@/domains/project/types/project.type'

export interface IProjectGetParams {
  status?: TProjectStatus
  limit?: number
  offset?: number
}

class ProjectService {
  async index(params?: IProjectGetParams): Promise<Project[]> {
    const response = await api.get<{ data: IProject[] }>(apiRoutesMap.projects, { params })
    return response.data.data.map(data => Project.load(data))
  }

  async get(id: string): Promise<Project> {
    const response = await api.get<{ data: IProject }>(`${apiRoutesMap.projects}/${id}`)
    return Project.load(response.data.data)
  }

  async create(project: Omit<IProject, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const response = await api.post<{ data: IProject }>(apiRoutesMap.projects, project)
    return Project.load(response.data.data)
  }

  async update(id: string, project: Partial<IProject>): Promise<Project> {
    const response = await api.patch<{ data: IProject }>(`${apiRoutesMap.projects}/${id}`, project)
    return Project.load(response.data.data)
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${apiRoutesMap.projects}/${id}`)
  }
}

export const projectService = new ProjectService()
