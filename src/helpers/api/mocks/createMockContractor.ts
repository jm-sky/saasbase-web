import { faker } from '@faker-js/faker'
import { formatISO } from 'date-fns'
import { v4 } from 'uuid'
import type { IContractor, IContractorAddress, IContractorBankAccount, IContractorContactPerson } from '@/models/contractor.model'
import type { TUUID } from '@/types/common'

const createMockAddress = (contractorId: TUUID): IContractorAddress => ({
  id: v4(),
  contractorId,
  label: faker.helpers.arrayElement(['Main Office', 'Branch Office', 'Warehouse', 'Headquarters']),
  countryId: v4(), // In a real app, this would be a valid country ID
  street: faker.location.streetAddress(),
  city: faker.location.city(),
  zip: faker.location.zipCode(),
  isDefault: faker.datatype.boolean(),
})

const createMockBankAccount = (contractorId: TUUID): IContractorBankAccount => ({
  id: v4(),
  contractorId,
  bankName: faker.company.name(),
  iban: faker.finance.iban(),
  currencies: faker.helpers.arrayElements(['USD', 'EUR', 'PLN'], { min: 1, max: 3 }),
  isDefault: faker.datatype.boolean(),
})

const createMockContactPerson = (contractorId: TUUID): IContractorContactPerson => ({
  id: v4(),
  contractorId,
  name: faker.person.fullName(),
  email: faker.helpers.arrayElement([faker.internet.email(), undefined]),
  phone: faker.helpers.arrayElement([faker.phone.number(), undefined]),
  position: faker.helpers.arrayElement([faker.person.jobTitle(), undefined]),
})

export const createMockContractor = (overrides: Partial<IContractor> = {}): IContractor => {
  const contractorId = v4()
  const tenantId = v4()

  return {
    id: contractorId,
    tenantId,
    name: faker.company.name(),
    taxId: faker.helpers.arrayElement([faker.string.numeric(10), undefined]),
    description: faker.helpers.arrayElement([faker.lorem.paragraph(), undefined]),
    isSupplier: faker.datatype.boolean(),
    isBuyer: faker.datatype.boolean(),
    addresses: faker.helpers.arrayElement([
      Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => createMockAddress(contractorId)),
      undefined,
    ]),
    bankAccounts: faker.helpers.arrayElement([
      Array.from({ length: faker.number.int({ min: 1, max: 2 }) }, () => createMockBankAccount(contractorId)),
      undefined,
    ]),
    contactPersons: faker.helpers.arrayElement([
      Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => createMockContactPerson(contractorId)),
      undefined,
    ]),
    createdAt: formatISO(new Date()),
    updatedAt: formatISO(new Date()),
    ...overrides,
  }
}
