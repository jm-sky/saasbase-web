export interface IUserAddress {
  street?: string
  city?: string
  postalCode?: string
  country?: string
}

const nonEmptyJoin = (parts: (string | undefined)[], separator: string): string => {
  return [
    ...parts,
  ].filter(part => part)
  .join(separator)
}

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

  get fullAddress(): string {
    return nonEmptyJoin([
      this.street,
      nonEmptyJoin([this.postalCode, this.city],  ' '),
      this.country,
    ], ', ')
  }
}
