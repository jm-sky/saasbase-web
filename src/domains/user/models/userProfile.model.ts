import { UserAddress } from '@/domains/user/models/userAddress.model'
import { fullName } from '@/lib/fullName'
import type { IUserProfile } from '../types/user.type'
import type { TDateTime, TUUID } from '@/domains/shared/types/common'

export class UserProfile implements IUserProfile {
  id: TUUID
  firstName: string
  lastName: string
  email: string
  phone?: string
  description?: string
  address?: UserAddress
  avatarUrl?: string
  createdAt: TDateTime

  constructor(data: IUserProfile) {
    this.id = data.id
    this.firstName = data.firstName
    this.lastName = data.lastName
    this.email = data.email
    this.phone = data.phone
    this.description = data.description
    this.address = data.address ? UserAddress.load(data.address) : undefined
    this.avatarUrl = data.avatarUrl
    this.createdAt = data.createdAt
  }

  static load(data: IUserProfile): UserProfile {
    return new UserProfile(data)
  }

  toJSON(): IUserProfile {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
      description: this.description,
      address: this.address?.toJSON(),
      avatarUrl: this.avatarUrl,
      createdAt: this.createdAt,
    }
  }

  get fullName(): string {
    return fullName(this)
  }

  get initials(): string {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return `${this.firstName[0] ?? ''}${this.lastName[0] ?? ''}`.toUpperCase()
  }
}
