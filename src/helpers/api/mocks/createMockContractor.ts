import { faker } from '@faker-js/faker'
import { formatISO } from 'date-fns'
import { v4 } from 'uuid'
import type { IContractor } from '@/models/contractor.model'

export const createMockContractor = (overrides: Partial<IContractor> = {}): IContractor => {
  return {
    id: v4(),
    tenantId: v4(),
    name: faker.company.name(),
    taxId: faker.helpers.arrayElement([faker.string.numeric(10), undefined]),
    email: faker.helpers.arrayElement([faker.internet.email(), undefined]),
    phone: faker.helpers.arrayElement([faker.phone.number(), undefined]),
    description: faker.helpers.arrayElement([faker.lorem.paragraph(), undefined]),
    isSupplier: faker.datatype.boolean(),
    isBuyer: faker.datatype.boolean(),
    createdAt: formatISO(new Date()),
    updatedAt: formatISO(new Date()),
    ...overrides,
  }
}
