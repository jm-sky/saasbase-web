import { Task } from '@/domains/task/models/task.model'
import api from '@/lib/api'
import { apiRoutesMap } from '@/lib/api/apiRoutes'
import { type TTaskPriority, type TTaskStatus } from '@/types/index'
import type { ITask } from '@/domains/task/types/task.type'

export interface ITaskGetParams {
  projectId?: string
  status?: TTaskStatus
  priority?: TTaskPriority
  assignedToId?: string
  limit?: number
  offset?: number
}

class TaskService {
  async index(params?: ITaskGetParams): Promise<Task[]> {
    const response = await api.get<{ data: ITask[] }>(apiRoutesMap.tasks, { params })
    return response.data.data.map(data => Task.load(data))
  }

  async get(id: string): Promise<Task> {
    const response = await api.get<{ data: ITask }>(`${apiRoutesMap.tasks}/${id}`)
    return Task.load(response.data.data)
  }

  async create(task: Omit<ITask, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const response = await api.post<{ data: ITask }>(apiRoutesMap.tasks, task)
    return Task.load(response.data.data)
  }

  async update(id: string, task: Partial<ITask>): Promise<Task> {
    const response = await api.patch<{ data: ITask }>(`${apiRoutesMap.tasks}/${id}`, task)
    return Task.load(response.data.data)
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${apiRoutesMap.tasks}/${id}`)
  }
}

export const taskService = new TaskService()
