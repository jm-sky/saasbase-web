import { UserAddress } from '@/domains/user/models/userAddress.model'
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
  image?: string
  role: string
  isEmailVerified: boolean
  lastLoginAt?: TDateTime
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
    this.image = data.image
    this.role = data.role
    this.isEmailVerified = data.isEmailVerified
    this.lastLoginAt = data.lastLoginAt
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
      image: this.image,
      role: this.role,
      isEmailVerified: this.isEmailVerified,
      lastLoginAt: this.lastLoginAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`
  }

  get initials(): string {
    return `${this.firstName[0]}${this.lastName[0]}`.toUpperCase()
  }
}
