import api from '@/helpers/api'
import { apiRoutesMap } from '@/helpers/api/apiRoutes'
import { type ITask, type TTaskPriority, type TTaskStatus } from '@/models/task.model'

export interface ITaskGetParams {
  projectId?: string
  status?: TTaskStatus
  priority?: TTaskPriority
  assignedToId?: string
  limit?: number
  offset?: number
}

class TaskService {
  async index(params?: ITaskGetParams): Promise<ITask[]> {
    const response = await api.get<{ tasks: ITask[] }>(apiRoutesMap.tasks, { params })
    return response.data.tasks
  }

  async get(id: string): Promise<ITask> {
    const response = await api.get<ITask>(`${apiRoutesMap.tasks}/${id}`)
    return response.data
  }

  async create(task: Omit<ITask, 'id' | 'createdAt' | 'updatedAt'>): Promise<ITask> {
    const response = await api.post<ITask>(apiRoutesMap.tasks, task)
    return response.data
  }

  async update(id: string, task: Partial<ITask>): Promise<ITask> {
    const response = await api.patch<ITask>(`${apiRoutesMap.tasks}/${id}`, task)
    return response.data
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${apiRoutesMap.tasks}/${id}`)
  }
}

export const taskService = new TaskService()
