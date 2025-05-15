import type { TDateTime, TUUID } from './common'

export type TAddressType = 'residence' | 'billing' | 'registeredOffice' | 'correspondence' | 'domicile' | 'contact'

export interface IAddress {
  id: TUUID
  tenantId: TUUID
  country: TUUID
  postalCode: string
  city: string
  street: string
  building: string
  flat: string
  description: string
  type: TAddressType
  isDefault: boolean
  createdAt: TDateTime
  updatedAt: TDateTime
  meta: Record<string, unknown>
}
