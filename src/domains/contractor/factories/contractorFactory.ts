import { faker } from '@faker-js/faker'
import { formatISO } from 'date-fns'
import { v4 } from 'uuid'
import type { IContractor, IContractorAddress, IContractorBankAccount, IContractorContactPerson } from '@/models/contractor.model'
import type { TUUID } from '@/types/common'

export class ContractorFactory {
  private static createAddress(contractorId: TUUID): IContractorAddress {
    return {
      id: v4(),
      contractorId,
      label: faker.helpers.arrayElement(['Main Office', 'Branch Office', 'Warehouse', 'Headquarters']),
      countryId: v4(), // In a real app, this would be a valid country ID
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      zip: faker.location.zipCode(),
      isDefault: faker.datatype.boolean(),
    }
  }

  private static createBankAccount(contractorId: TUUID): IContractorBankAccount {
    return {
      id: v4(),
      contractorId,
      bankName: faker.company.name(),
      iban: faker.finance.iban(),
      currencies: faker.helpers.arrayElements(['USD', 'EUR', 'PLN'], { min: 1, max: 3 }),
      isDefault: faker.datatype.boolean(),
    }
  }

  private static createContactPerson(contractorId: TUUID): IContractorContactPerson {
    return {
      id: v4(),
      contractorId,
      name: faker.person.fullName(),
      email: faker.helpers.arrayElement([faker.internet.email(), undefined]),
      phone: faker.helpers.arrayElement([faker.phone.number(), undefined]),
      position: faker.helpers.arrayElement([faker.person.jobTitle(), undefined]),
    }
  }

  static create(overrides: Partial<IContractor> = {}): IContractor {
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
        Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => this.createAddress(contractorId)),
        undefined,
      ]),
      bankAccounts: faker.helpers.arrayElement([
        Array.from({ length: faker.number.int({ min: 1, max: 2 }) }, () => this.createBankAccount(contractorId)),
        undefined,
      ]),
      contactPersons: faker.helpers.arrayElement([
        Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => this.createContactPerson(contractorId)),
        undefined,
      ]),
      createdAt: formatISO(new Date()),
      updatedAt: formatISO(new Date()),
      ...overrides,
    }
  }
}
