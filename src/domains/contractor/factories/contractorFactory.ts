import { faker } from '@faker-js/faker'
import { formatISO } from 'date-fns'
import { v4 } from 'uuid'
import type { IContractor, IContractorAddress, IContractorBankAccount, IContractorContact } from '@/domains/contractor/models/contractor.model'
import type { TUUID } from '@/domains/shared/types/common'

export class ContractorFactory {
  private static createAddress(): IContractorAddress {
    return {
      id: v4(),
      tenantId: v4(),
      type: faker.helpers.arrayElement(['residence', 'billing', 'registeredOffice', 'correspondence', 'domicile', 'contact']),
      country: faker.location.country(),
      city: faker.location.city(),
      postalCode: faker.location.zipCode(),
      street: faker.location.streetAddress(),
      building: faker.location.buildingNumber(),
      flat: faker.location.secondaryAddress(),
      description: faker.lorem.sentence(),
      isDefault: faker.datatype.boolean(),
      meta: {},
      createdAt: formatISO(new Date()),
      updatedAt: formatISO(new Date()),
    }
  }

  private static createBankAccount(contractorId: TUUID): IContractorBankAccount {
    return {
      id: v4(),
      contractorId,
      bankName: faker.company.name(),
      iban: faker.finance.iban(),
      currency: faker.helpers.arrayElement(['USD', 'EUR', 'PLN']),
      isDefault: faker.datatype.boolean(),
      createdAt: formatISO(new Date()),
      updatedAt: formatISO(new Date()),
    }
  }

  private static createContactPerson(contractorId: TUUID): IContractorContact {
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
      createdAt: formatISO(new Date()),
      updatedAt: formatISO(new Date()),
      ...overrides,
    }
  }
}
