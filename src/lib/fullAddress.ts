import type { IAddress } from '@/domains/shared/types/address.type'

export const fullAddress = (address: IAddress): string => {
  const street: string = [
    address.street,
    address.building,
    address.building && address.flat ? '/' : null,
    address.flat,
  ].filter(Boolean).join(' ')

  const addressParts: string = [
    street,
    street ? ',' : null,
    address.postalCode,
    address.city,
    address.country ? ',' : null,
    address.country,
  ].filter(Boolean).join(' ').replaceAll(' , ', ', ')

  return addressParts
}
