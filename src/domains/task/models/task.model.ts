import type { ITask } from '../types/task.type'
import type { TTaskPriority, TTaskStatus } from '@/types/index'

export class Task {
  id: string
  projectId: string
  title: string
  description?: string
  status: TTaskStatus
  priority: TTaskPriority
  assignedToId?: string
  createdById: string
  dueDate?: string
  createdAt: string
  updatedAt: string

  constructor(data: ITask) {
    this.id = data.id
    this.projectId = data.projectId
    this.title = data.title
    this.description = data.description
    this.status = data.status
    this.priority = data.priority
    this.assignedToId = data.assignedToId
    this.createdById = data.createdById
    this.dueDate = data.dueDate
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  static load(data: ITask): Task {
    return new Task(data)
  }

  toJSON(): ITask {
    return {
      id: this.id,
      projectId: this.projectId,
      title: this.title,
      description: this.description,
      status: this.status,
      priority: this.priority,
      assignedToId: this.assignedToId,
      createdById: this.createdById,
      dueDate: this.dueDate,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }
}
