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

  get taxId(): string | undefined {
    return this.data.taxId
  }

  get email(): string | undefined {
    return this.data.email
  }

  get phone(): string | undefined {
    return this.data.phone
  }

  get description(): string | undefined {
    return this.data.description
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
}
