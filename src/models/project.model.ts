import { type TProjectStatus } from '@/types'

export interface IProject {
  id: string
  tenantId: string
  name: string
  description?: string
  status: TProjectStatus
  ownerId: string
  createdAt: string
  updatedAt: string
}

export class Project {
  static load(data: IProject): Project {
    return new Project(data)
  }

  constructor(private data: IProject) {}

  get id(): string {
    return this.data.id
  }

  get tenantId(): string {
    return this.data.tenantId
  }

  get name(): string {
    return this.data.name
  }

  get description(): string | undefined {
    return this.data.description
  }

  get status(): TProjectStatus {
    return this.data.status
  }

  get ownerId(): string {
    return this.data.ownerId
  }

  get createdAt(): Date {
    return new Date(this.data.createdAt)
  }

  get updatedAt(): Date {
    return new Date(this.data.updatedAt)
  }
}
