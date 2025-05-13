import { UserAddress } from '@/domains/user/models/userAddress.model'
import { fullName } from '@/lib/fullName'
import type { IUser } from '../types/user.type'
import type { TDateTime, TUUID } from '@/types/common'

export class User implements IUser {
  id: TUUID
  firstName: string
  lastName: string
  email: string
  phone?: string
  birthDate?: string
  description?: string
  address?: UserAddress
  avatarUrl?: string
  isEmailVerified: boolean
  isTwoFactorEnabled: boolean
  createdAt: TDateTime
  updatedAt: TDateTime

  constructor(data: IUser) {
    this.id = data.id
    this.firstName = data.firstName
    this.lastName = data.lastName
    this.email = data.email
    this.phone = data.phone
    this.birthDate = data.birthDate
    this.description = data.description
    this.address = data.address ? UserAddress.load(data.address) : undefined
    this.avatarUrl = data.avatarUrl
    this.isEmailVerified = data.isEmailVerified
    this.isTwoFactorEnabled = data.isTwoFactorEnabled
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  static load(data: IUser): User {
    return new User(data)
  }

  toJSON(): IUser {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      avatarUrl: this.avatarUrl,
      isEmailVerified: this.isEmailVerified,
      isTwoFactorEnabled: this.isTwoFactorEnabled,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }

  get fullName(): string {
    return fullName(this)
  }

  get initials(): string {
    return `${this.firstName[0]}${this.lastName[0]}`.toUpperCase()
  }
}
