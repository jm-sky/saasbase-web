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
    if (!data.id) throw new Error('Project ID is required')
    if (!data.tenantId) throw new Error('Tenant ID is required')
    if (!data.name) throw new Error('Project name is required')
    if (!data.ownerId) throw new Error('Owner ID is required')
    if (!data.status) throw new Error('Project status is required')

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

  get description(): string {
    return this.data.description ?? ''
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

  toJSON(): IProject {
    return { ...this.data }
  }

  equals(other: Project): boolean {
    return this.id === other.id
  }

  isValid(): boolean {
    return Boolean(
      this.id &&
      this.tenantId &&
      this.name &&
      this.ownerId &&
      this.status &&
      this.createdAt &&
      this.updatedAt
    )
  }
}
