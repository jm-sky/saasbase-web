import { faker } from '@faker-js/faker'
import { formatISO } from 'date-fns'
import { v4 } from 'uuid'
import type { IProduct } from '@/models/product.model'

export class ProductFactory {
  static create(overrides: Partial<IProduct> = {}): IProduct {
    const productId = v4()
    const tenantId = v4()

    return {
      id: productId,
      tenantId,
      name: faker.commerce.productName(),
      description: faker.helpers.arrayElement([faker.commerce.productDescription(), undefined]),
      unitId: v4(), // In a real app, this would be a valid unit ID
      priceNet: parseFloat(faker.commerce.price()),
      vatRateId: v4(), // In a real app, this would be a valid VAT rate ID
      createdAt: formatISO(new Date()),
      updatedAt: formatISO(new Date()),
      ...overrides,
    }
  }
}
