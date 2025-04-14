import type { TDateTime, TUUID } from '@/types/common'

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
  taxId?: string
  description?: string
  isSupplier: boolean
  isBuyer: boolean
  addresses?: IContractorAddress[]
  bankAccounts?: IContractorBankAccount[]
  contactPersons?: IContractorContactPerson[]
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

  get isSupplier(): boolean {
    return this.data.isSupplier
  }

  get isBuyer(): boolean {
    return this.data.isBuyer
  }

  get addresses(): IContractorAddress[] {
    return this.data.addresses ?? []
  }

  get bankAccounts(): IContractorBankAccount[] {
    return this.data.bankAccounts ?? []
  }

  get contactPersons(): IContractorContactPerson[] {
    return this.data.contactPersons ?? []
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
    return Boolean(this.id && this.tenantId && this.name && this.createdAt && this.updatedAt)
  }

  hasAddresses(): boolean {
    return this.addresses.length > 0
  }

  hasBankAccounts(): boolean {
    return this.bankAccounts.length > 0
  }

  hasContactPersons(): boolean {
    return this.contactPersons.length > 0
  }

  getDefaultAddress(): IContractorAddress | undefined {
    return this.addresses.find(addr => addr.isDefault)
  }

  getDefaultBankAccount(): IContractorBankAccount | undefined {
    return this.bankAccounts.find(acc => acc.isDefault)
  }
}
