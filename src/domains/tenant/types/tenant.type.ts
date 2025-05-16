import type { IAddress } from '@/domains/shared/types/address.type'
import type { IBankAccount } from '@/domains/shared/types/bankAccount.type'
import type { TDateTime, TUUID } from '@/domains/shared/types/common'
import type { IMedia } from '@/domains/shared/types/media.type'

export interface ITenantSimple {
  id: TUUID
  name: string
  slug: string
  createdAt: TDateTime
  updatedAt: TDateTime
}

export interface ITenantAddress extends IAddress {
  id: TUUID
  tenantId: TUUID
  meta: Record<string, unknown>
}

export type ITenantAddressCreate = Omit<ITenantAddress, 'id' | 'tenantId' | 'meta' | 'createdAt' | 'updatedAt'>

export interface ITenantBankAccount extends IBankAccount {
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

export type ITenantBankAccountCreate = Omit<ITenantBankAccount, 'id' | 'contractorId' | 'createdAt' | 'updatedAt'>

export interface ITenant {
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
  tags: string[]
  logoUrl?: string
  logo?: IMedia
  createdAt: TDateTime
  updatedAt: TDateTime
}

export type ITenantCreate = Omit<ITenant, 'id' | 'tenantId' | 'logo' | 'logoUrl' | 'createdAt' | 'updatedAt'>