import { type IProject } from '../types/project.type'

export class Project {
  static load(data: IProject): Project {
    if (!data.id) throw new Error('Project ID is required')
    if (!data.tenantId) throw new Error('Tenant ID is required')
    if (!data.name) throw new Error('Project name is required')
    if (!data.ownerId) throw new Error('Owner ID is required')
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!data.status) throw new Error('Project status is required')
    if (!data.createdAt) throw new Error('Start date is required')
    if (!data.updatedAt) throw new Error('End date is required')

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

  get status(): string {
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
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return Boolean(this.id && this.name && this.status && this.createdAt && this.updatedAt)
  }
}
