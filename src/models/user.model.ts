import dayjs from 'dayjs'
import { type IUserAddress, UserAddress } from '@/models/userAddress.model'

export interface IPublicUser {
  id: number | string
  firstName: string
  lastName: string
  email: string
  phone?: string
  birthDate?: string
  address?: {
    address?: string
    city?: string
    postalCode?: string
    country?: string
  }
  image?: string
}

export interface IUserData {
  id: string
  name: string
  lastName: string
  email: string
  phone?: string
  birthDate?: string | Date
  address?: IUserAddress
  image?: string
  createdAt: string | Date
}

export interface IUser {
  id: string
  name: string
  lastName: string
  email: string
  phone?: string
  birthDate?: Date
  address?: IUserAddress
  image?: string
  createdAt: Date
}

export class User implements IUser {
  id: string
  name: string
  lastName: string
  email: string
  phone?: string
  birthDate?: Date
  address?: UserAddress
  image?: string
  createdAt: Date

  private constructor(payload: IUserData) {
    this.id = payload.id
    this.name = payload.name
    this.lastName = payload.lastName
    this.email = payload.email
    this.phone = payload.phone
    this.birthDate = payload.birthDate ? dayjs(payload.birthDate).toDate() : undefined
    this.address = payload.address ? new UserAddress(payload.address) : undefined
    this.image = payload.image
    this.createdAt = dayjs(payload.createdAt).toDate()
  }

  static create(payload: Omit<IUserData, 'id' | 'createdAt'>) {
    return new User({
      ...payload,
      id: self.crypto.randomUUID(),
      createdAt: new Date(),
    })
  }

  static load(payload: IUserData) {
    return new User(payload)
  }

  get fullName(): string {
    return `${this.name} ${this.lastName}`
  }

  get initials(): string {
    return `${this.name[0]}${this.lastName[0]}`
  }
}
