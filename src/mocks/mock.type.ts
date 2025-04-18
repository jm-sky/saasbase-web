import type { IProject } from '@/domains/project/types/project.type'
import type { IUserStored } from '@/domains/user/types/user.type'
import type { IContractor } from '@/models/contractor.model'
import type { IProduct } from '@/models/product.model'

export interface MockStorage {
  users: IUserStored[]
  tokens: string[]
  projects: IProject[]
  contractors: IContractor[]
  products: IProduct[]
}
