import { type IUserAddress } from '../types/user.type'

export class UserAddress implements IUserAddress {
  street?: string
  city?: string
  postalCode?: string
  country?: string

  constructor(payload: IUserAddress) {
    this.street = payload.street
    this.city = payload.city
    this.postalCode = payload.postalCode
    this.country = payload.country
  }

  static load(payload: IUserAddress): UserAddress {
    return new UserAddress(payload)
  }

  get fullAddress(): string {
    return this.nonEmptyJoin([
      this.street,
      this.nonEmptyJoin([this.postalCode, this.city], ' '),
      this.country,
    ], ', ')
  }

  private nonEmptyJoin(items: (string | undefined)[], separator: string): string {
    return items.filter(Boolean).join(separator)
  }

  toJSON(): IUserAddress {
    return {
      street: this.street,
      city: this.city,
      postalCode: this.postalCode,
      country: this.country,
    }
  }
}
