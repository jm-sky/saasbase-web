import { buildSpatieQuery } from '@/domains/shared/helpers/filtering'
import api from '@/lib/api'
import { apiRoutesMap } from '@/lib/api/apiRoutes'
import type { FilterDefinition, IResource, IResourceCollection } from '@/domains/shared/types/resource.type'
import type { ITask } from '@/domains/task/types/task.type'
import type { SortingState } from '@tanstack/vue-table'

export interface ITaskFilters {
  search?: string
  page?: number
  perPage?: number
  filter?: {
    projectId?: FilterDefinition
    statusId?: FilterDefinition
    assigneeId?: FilterDefinition
    priority?: FilterDefinition
    title?: FilterDefinition
    description?: FilterDefinition
    dueDate?: FilterDefinition
    createdAt?: FilterDefinition
    updatedAt?: FilterDefinition
  }
  sort?: SortingState
}

class TaskService {
  async index(filters?: ITaskFilters): Promise<IResourceCollection<ITask>> {
    const params = buildSpatieQuery(filters ?? { filter: {} })
    const response = (await api.get<IResourceCollection<ITask>>(apiRoutesMap.tasks, { params })).data
    return response
  }

  async get(id: string): Promise<ITask> {
    const response = (await api.get<IResource<ITask>>(`${apiRoutesMap.tasks}/${id}`)).data
    return response.data
  }

  async create(task: Omit<ITask, 'id' | 'createdAt' | 'updatedAt'>): Promise<ITask> {
    const response = (await api.post<IResource<ITask>>(apiRoutesMap.tasks, task)).data
    return response.data
  }

  async update(id: string, task: Partial<ITask>): Promise<ITask> {
    const response = (await api.patch<IResource<ITask>>(`${apiRoutesMap.tasks}/${id}`, task)).data
    return response.data
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${apiRoutesMap.tasks}/${id}`)
  }
}

export const taskService = new TaskService()
