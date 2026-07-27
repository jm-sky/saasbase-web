import type { TDateTime, TUUID } from './common'

export interface IBankAccount {
  id?: TUUID
  bankName?: string
  iban: string
  currency?: string
  country?: string
  swift?: string
  isDefault: boolean
  description?: string
  createdAt?: TDateTime
  updatedAt?: TDateTime
}

export type IBankAccountCreate = Omit<IBankAccount, 'id' | 'createdAt' | 'updatedAt'>
