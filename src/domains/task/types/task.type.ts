import type { TDateTime, TUUID } from '@/domains/shared/types/common'
import type { IUserPreview } from '@/domains/user/types/user.type'

export type TTaskPriority = 'low' | 'medium' | 'high'
export type TTaskStatus = 'todo' | 'in_progress' | 'done'

export interface ITaskStatus {
  id: TUUID
  name: string
  color?: string
  sortOrder?: number
  isDefault: boolean
  createdAt: TDateTime
  updatedAt: TDateTime
}

export interface ITask {
  id: TUUID
  projectId: TUUID
  title: string
  description?: string
  status: ITaskStatus
  priority: TTaskPriority
  assignedToId?: TUUID
  assignee?: IUserPreview
  createdById: TUUID
  dueDate?: string
  createdAt: TDateTime
  updatedAt: TDateTime
}

export type ITaskCreate = Omit<ITask, 'id' | 'createdAt' | 'updatedAt'>
