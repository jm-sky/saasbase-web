import type { IAddress } from '@/domains/shared/types/address.type'
import type { TDateTime, TUUID } from '@/domains/shared/types/common'

export interface IContractorAddress extends IAddress {
  id: TUUID
  tenantId: TUUID
  meta: Record<string, unknown>
}

export type IContractorAddressCreate = Omit<IContractorAddress, 'id' | 'tenantId' | 'meta' | 'createdAt' | 'updatedAt'>

export interface IContractorBankAccount {
  id: TUUID
  contractorId: TUUID
  bankName?: string
  iban: string
  currencies?: string[]
  isDefault: boolean
}

export type IContractorBankAccountCreate = Omit<IContractorBankAccount, 'id' | 'contractorId'>

export interface IContractorContactPerson {
  id: TUUID
  contractorId: TUUID
  name: string
  email?: string
  phone?: string
  position?: string
}

export type IContractorContactPersonCreate = Omit<IContractorContactPerson, 'id' | 'contractorId'>

export interface IContractor {
  id: TUUID
  tenantId: TUUID
  name: string
  email?: string
  phone?: string
  country?: string
  taxId?: string
  description?: string
  isSupplier: boolean
  isBuyer: boolean
  logo?: string
  createdAt: TDateTime
  updatedAt: TDateTime
}

export type IContractorCreate = Omit<IContractor, 'id' | 'createdAt' | 'updatedAt'>
