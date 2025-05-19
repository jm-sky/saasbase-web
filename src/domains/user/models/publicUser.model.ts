import type { IUserPreview } from '../types/user.type'
import type { TDateTime, TUUID } from '@/domains/shared/types/common'

export class UserPreview implements IUserPreview {
  id: TUUID
  name: string
  email: string
  avatarUrl?: string
  createdAt: TDateTime

  constructor(data: IUserPreview) {
    this.id = data.id
    this.name = data.name
    this.email = data.email
    this.avatarUrl = data.avatarUrl
    this.createdAt = data.createdAt
  }

  static load(data: IUserPreview): UserPreview {
    return new UserPreview(data)
  }

  toJSON(): IUserPreview {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      avatarUrl: this.avatarUrl,
      createdAt: this.createdAt,
    }
  }

  get fullName(): string {
    return this.name
  }

  get initials(): string {
    return this.name.split(' ').map((name) => name[0]).join('').toUpperCase()
  }
}
