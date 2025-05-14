import type { TDate, TDateTime, TUUID } from '@/domains/shared/types/common'

export interface IUserStored {
  id: TUUID
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
  birthDate?: string
  description?: string
  address?: IUserAddress
  image?: string
  isEmailVerified: boolean
  isTwoFactorEnabled: boolean
  lastLoginAt?: TDateTime
  createdAt: TDateTime
  updatedAt: TDateTime
}

export interface IUser {
  id: TUUID
  firstName: string
  lastName: string
  email: string
  phone?: string
  birthDate?: string
  description?: string
  address?: IUserAddress
  avatarUrl?: string
  isEmailVerified: boolean
  isTwoFactorEnabled: boolean
  createdAt: TDateTime
  updatedAt: TDateTime
}

export type IUserCreate = Omit<IUser, 'id' | 'createdAt' | 'updatedAt' | 'lastLoginAt' | 'isEmailVerified'>

export type IPublicUser = Pick<IUser, 'id' | 'firstName' | 'lastName' | 'email' | 'phone' | 'description' | 'address' | 'avatarUrl' | 'createdAt'>

export interface IUserAddress {
  street?: string
  city?: string
  postalCode?: string
  country?: string
}

export interface IUserSettings {
  userId: TUUID
  language: string
  theme: 'light' | 'dark' | 'system'
  timezone?: string
  twoFactorEnabled: boolean
  twoFactorConfirmed: boolean
  preferences?: Record<string, unknown>
}

export type TOAuthProvider = 'google' | 'gitlab' | 'github' | 'microsoft'

export interface IUserOAuthAccount {
  id: TUUID
  userId: TUUID
  provider: TOAuthProvider
  providerUserId: TUUID
  email?: string
  linkedAt: TDateTime
}

export interface IUserTenant {
  id: TUUID
  userId: TUUID
  tenantId: TUUID
  role: string
  permissions?: string[]
  joinedAt: TDateTime
}

export interface IUserSkill {
  userId: TUUID
  skillId: TUUID
  level: number
  acquiredAt?: TDate
  createdAt: TDateTime
  updatedAt: TDateTime
}
