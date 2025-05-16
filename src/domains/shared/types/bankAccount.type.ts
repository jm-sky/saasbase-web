import type { TDateTime, TUUID } from './common'

export interface IBankAccount {
  id: TUUID
  bankName?: string
  iban: string
  currency?: string
  isDefault: boolean
  description?: string
  createdAt: TDateTime
  updatedAt: TDateTime
}