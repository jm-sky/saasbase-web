import type { IUserData } from '@/models/user.model'

export interface MockUserStored extends IUserData {
  password: string
}

export interface MockStorage {
  users: MockUserStored[]
  tokens: string[]
}
