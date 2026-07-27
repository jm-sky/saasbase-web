import api from '@/lib/api'
import type { IProjectStatus } from '@/domains/project/types/project.type'
import type { IResourceCollection } from '@/domains/shared/types/resource.type'

class ProjectStatusService {
  async index(): Promise<IProjectStatus[]> {
    const response = await api.get<IResourceCollection<IProjectStatus>>('/project-statuses')
    return response.data.data
  }
}

export const projectStatusService = new ProjectStatusService()
