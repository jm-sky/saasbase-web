import type { TDateTime } from '@/domains/shared/types/common'

export type TTaskPriority = 'low' | 'medium' | 'high'
export type TTaskStatus = 'todo' | 'in_progress' | 'done'
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
  createdAt: TDateTime
  updatedAt: TDateTime
}

export type ITaskCreate = Omit<ITask, 'id' | 'createdAt' | 'updatedAt'>
