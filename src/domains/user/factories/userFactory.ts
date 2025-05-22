import { faker } from '@faker-js/faker'
import { formatISO } from 'date-fns'
import { v4 } from 'uuid'
import type { IUserStored } from '@/domains/user/types/user.type'

/**
 * https://fakerjs.dev/api/helpers
 * https://www.dicebear.com/how-to-use/http-api/
 */
export class UserFactory {
  static create(overrides: Partial<IUserStored> = {}, withImage: boolean | undefined = undefined): IUserStored {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    const avatarStyle = faker.helpers.arrayElement(['adventurer', 'pixel-art', 'avataaars-neutral'])

    return {
      id: v4(),
      firstName,
      lastName,
      password: faker.internet.password(),
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      birthDate: faker.helpers.maybe(() => faker.date.birthdate().toISOString()),
      description: faker.helpers.maybe(() => faker.lorem.sentence()),
      image: withImage ? `https://api.dicebear.com/9.x/${avatarStyle}/svg?seed=${firstName}` : undefined,
      isEmailVerified: true,
      isTwoFactorEnabled: false,
      lastLoginAt: faker.helpers.maybe(() => faker.date.recent().toISOString()),
      createdAt: formatISO(new Date()),
      updatedAt: formatISO(new Date()),
      ...overrides,
    }
  }
}
