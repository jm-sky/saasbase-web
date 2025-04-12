import { type TTaskPriority, type TTaskStatus } from '@/types'

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

export class Task {
  static load(data: ITask): Task {
    return new Task(data)
  }

  constructor(private data: ITask) {}

  get id(): string {
    return this.data.id
  }

  get projectId(): string {
    return this.data.projectId
  }

  get title(): string {
    return this.data.title
  }

  get description(): string | undefined {
    return this.data.description
  }

  get status(): TTaskStatus {
    return this.data.status
  }

  get priority(): TTaskPriority {
    return this.data.priority
  }

  get assignedToId(): string | undefined {
    return this.data.assignedToId
  }

  get createdById(): string {
    return this.data.createdById
  }

  get dueDate(): Date | undefined {
    return this.data.dueDate ? new Date(this.data.dueDate) : undefined
  }

  get createdAt(): Date {
    return new Date(this.data.createdAt)
  }

  get updatedAt(): Date {
    return new Date(this.data.updatedAt)
  }
}
