import api from '@/helpers/api'
import { apiRoutesMap } from '@/helpers/api/apiRoutes'
import { type ITask, Task } from '@/models/task.model'
import { type TTaskPriority, type TTaskStatus } from '@/types/index'

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
    const response = await api.get<{ tasks: ITask[] }>(apiRoutesMap.tasks, { params })
    return response.data.tasks.map(data => Task.load(data))
  }

  async get(id: string): Promise<Task> {
    const response = await api.get<ITask>(`${apiRoutesMap.tasks}/${id}`)
    return Task.load(response.data)
  }

  async create(task: Omit<ITask, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const response = await api.post<ITask>(apiRoutesMap.tasks, task)
    return Task.load(response.data)
  }

  async update(id: string, task: Partial<ITask>): Promise<Task> {
    const response = await api.patch<ITask>(`${apiRoutesMap.tasks}/${id}`, task)
    return Task.load(response.data)
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${apiRoutesMap.tasks}/${id}`)
  }
}

export const taskService = new TaskService()
