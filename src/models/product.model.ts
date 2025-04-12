export interface IProduct {
  id: string
  tenantId: string
  name: string
  description?: string
  unitId: string
  priceNet: number
  vatRateId: string
  createdAt: string
  updatedAt: string
}

export class Product {
  static load(data: IProduct): Product {
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

  get description(): string | undefined {
    return this.data.description
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
}
