import { apiRoutesMap } from '@/composables/api/apiRoutes'
import { Project } from '@/domains/project/models/project.model'
import api from '@/helpers/api'
import { type TProjectStatus } from '@/types/index'
import type { IProject } from '@/domains/project/types/project.type'

export interface IProjectGetParams {
  status?: TProjectStatus
  limit?: number
  offset?: number
}

class ProjectService {
  async index(params?: IProjectGetParams): Promise<Project[]> {
    const response = await api.get<{ projects: IProject[] }>(apiRoutesMap.projects, { params })
    return response.data.projects.map(data => Project.load(data))
  }

  async get(id: string): Promise<Project> {
    const response = await api.get<IProject>(`${apiRoutesMap.projects}/${id}`)
    return Project.load(response.data)
  }

  async create(project: Omit<IProject, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const response = await api.post<IProject>(apiRoutesMap.projects, project)
    return Project.load(response.data)
  }

  async update(id: string, project: Partial<IProject>): Promise<Project> {
    const response = await api.patch<IProject>(`${apiRoutesMap.projects}/${id}`, project)
    return Project.load(response.data)
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${apiRoutesMap.projects}/${id}`)
  }
}

export const projectService = new ProjectService()
