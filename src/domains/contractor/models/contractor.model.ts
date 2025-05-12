import type { TDateTime, TUUID } from '@/domains/shared/types/common'

export interface IContractorAddress {
  id: TUUID
  contractorId: TUUID
  label: string
  countryId: TUUID
  street: string
  city: string
  zip: string
  isDefault: boolean
}

export type IContractorAddressCreate = Omit<IContractorAddress, 'id' | 'contractorId'>

export interface IContractorBankAccount {
  id: TUUID
  contractorId: TUUID
  bankName: string
  iban: string
  currencies: string[]
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
  createdAt: TDateTime
  updatedAt: TDateTime
}

export type IContractorCreate = Omit<IContractor, 'id' | 'createdAt' | 'updatedAt'>

export class Contractor {
  static load(data: IContractor): Contractor {
    if (!data.id) throw new Error('Contractor ID is required')
    if (!data.tenantId) throw new Error('Tenant ID is required')
    if (!data.name) throw new Error('Contractor name is required')

    return new Contractor(data)
  }

  constructor(private data: IContractor) {}

  get id(): string {
    return this.data.id
  }

  get tenantId(): string {
    return this.data.tenantId
  }

  get name(): string {
    return this.data.name
  }

  get taxId(): string {
    return this.data.taxId ?? ''
  }

  get description(): string {
    return this.data.description ?? ''
  }

  get email(): string {
    return this.data.email ?? ''
  }

  get phone(): string {
    return this.data.phone ?? ''
  }

  get country(): string {
    return this.data.country ?? ''
  }

  get isSupplier(): boolean {
    return this.data.isSupplier
  }

  get isBuyer(): boolean {
    return this.data.isBuyer
  }

  get createdAt(): Date {
    return new Date(this.data.createdAt)
  }

  get updatedAt(): Date {
    return new Date(this.data.updatedAt)
  }

  toJSON(): IContractor {
    return { ...this.data }
  }

  equals(other: Contractor): boolean {
    return this.id === other.id
  }

  isValid(): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return Boolean(this.id && this.tenantId && this.name && this.createdAt && this.updatedAt)
  }
}
