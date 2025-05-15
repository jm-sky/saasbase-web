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
  currency?: string
  isDefault: boolean
  description?: string
  createdAt: TDateTime
  updatedAt: TDateTime
}

export type IContractorBankAccountCreate = Omit<IContractorBankAccount, 'id' | 'contractorId' | 'createdAt' | 'updatedAt'>

export interface IContractorContact {
  id: TUUID
  contractorId: TUUID
  name: string
  email?: string
  phone?: string
  position?: string
  description?: string
}

export type IContractorContactCreate = Omit<IContractorContact, 'id' | 'contractorId'>

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
