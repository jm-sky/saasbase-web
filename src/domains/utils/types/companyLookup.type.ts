import type { IAddress } from '@/domains/shared/types/address.type'
import type { IBankAccount } from '@/domains/shared/types/bankAccount.type'

export interface ICompanyPerson {
  name?: string
  nip?: string
  pesel?: string
}

export interface ICompanyLookupResponse {
  name: string
  country: string
  vatId?: string | null
  regon?: string | null
  shortName?: string | null
  phoneNumber?: string | null
  email?: string | null
  website?: string | null
  address?: IAddress | null
  bankAccount?: IBankAccount | null
}
