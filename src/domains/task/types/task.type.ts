import type { TTaskPriority, TTaskStatus } from '@/types/index'

export interface ITask {
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
}

export type ITaskCreate = Omit<ITask, 'id' | 'createdAt' | 'updatedAt'>
