import { UserAddress } from '@/domains/user/models/userAddress.model'
import type { IPublicUser } from '../types/user.type'
import type { TDateTime, TUUID } from '@/types/common'

export class PublicUser implements IPublicUser {
  id: TUUID
  firstName: string
  lastName: string
  email: string
  phone?: string
  description?: string
  address?: UserAddress
  image?: string
  role: string
  createdAt: TDateTime

  constructor(data: IPublicUser) {
    this.id = data.id
    this.firstName = data.firstName
    this.lastName = data.lastName
    this.email = data.email
    this.phone = data.phone
    this.description = data.description
    this.address = data.address ? UserAddress.load(data.address) : undefined
    this.image = data.image
    this.role = data.role
    this.createdAt = data.createdAt
  }

  static load(data: IPublicUser): PublicUser {
    return new PublicUser(data)
  }

  toJSON(): IPublicUser {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
      description: this.description,
      address: this.address?.toJSON(),
      image: this.image,
      role: this.role,
      createdAt: this.createdAt,
    }
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`
  }

  get initials(): string {
    return `${this.firstName[0]}${this.lastName[0]}`.toUpperCase()
  }
}
