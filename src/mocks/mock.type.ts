import type { IContractor } from '@/models/contractor.model'
import type { IProject } from '@/models/project.model'
import type { IUser } from '@/models/user.model'

export interface MockUserStored extends Omit<IUser, 'birthDate' | 'createdAt'> {
  birthDate?: string
  password: string
  createdAt: string
}

export interface MockStorage {
  users: MockUserStored[]
  tokens: string[]
  projects: IProject[]
  contractors: IContractor[]
}
