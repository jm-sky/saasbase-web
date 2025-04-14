import { type TDateTime } from '@/types/common'

export interface IProduct {
  id: string
  tenantId: string
  name: string
  description?: string
  unitId: string
  priceNet: number
  vatRateId: string
  createdAt: TDateTime
  updatedAt: TDateTime
}

export type IProductCreate = Omit<IProduct, 'id' | 'createdAt' | 'updatedAt'>

export class Product {
  static load(data: IProduct): Product {
    if (!data.id) throw new Error('Product ID is required')
    if (!data.tenantId) throw new Error('Tenant ID is required')
    if (!data.name) throw new Error('Product name is required')
    if (!data.unitId) throw new Error('Unit ID is required')
    if (!data.vatRateId) throw new Error('VAT rate ID is required')
    if (data.priceNet < 0) throw new Error('Price must be non-negative')

    return new Product(data)
  }

  constructor(private data: IProduct) {}

  get id(): string {
    return this.data.id
  }

  get tenantId(): string {
    return this.data.tenantId
  }

  get name(): string {
    return this.data.name
  }

  get description(): string {
    return this.data.description ?? ''
  }

  get unitId(): string {
    return this.data.unitId
  }

  get priceNet(): number {
    return this.data.priceNet
  }

  get vatRateId(): string {
    return this.data.vatRateId
  }

  get createdAt(): Date {
    return new Date(this.data.createdAt)
  }

  get updatedAt(): Date {
    return new Date(this.data.updatedAt)
  }

  toJSON(): IProduct {
    return { ...this.data }
  }

  equals(other: Product): boolean {
    return this.id === other.id
  }

  isValid(): boolean {
    return Boolean(
      this.id &&
      this.tenantId &&
      this.name &&
      this.unitId &&
      this.vatRateId &&
      this.priceNet >= 0 &&
      this.createdAt &&
      this.updatedAt
    )
  }

  hasDescription(): boolean {
    return Boolean(this.description)
  }
}
