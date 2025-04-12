export interface IContractor {
  id: string
  tenantId: string
  name: string
  taxId?: string
  email?: string
  phone?: string
  description?: string
  isSupplier: boolean
  isBuyer: boolean
  createdAt: string
  updatedAt: string
}

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

  get email(): string {
    return this.data.email ?? ''
  }

  get phone(): string {
    return this.data.phone ?? ''
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
    return Boolean(
      this.id &&
      this.tenantId &&
      this.name &&
      this.createdAt &&
      this.updatedAt
    )
  }

  hasContactInfo(): boolean {
    return Boolean(this.email || this.phone)
  }
}
