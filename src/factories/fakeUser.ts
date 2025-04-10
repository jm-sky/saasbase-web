import { faker } from '@faker-js/faker'
import { formatISO } from 'date-fns'
import { v4 } from 'uuid'
import type { MockUserStored } from '@/helpers/api/mocks/mock.type'

/**
 * https://fakerjs.dev/api/helpers
 * https://www.dicebear.com/how-to-use/http-api/
 */
export const fakeUser = (withImage: boolean | undefined = undefined): MockUserStored => {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  const avatarStyle = faker.helpers.arrayElement(['adventurer', 'pixel-art', 'avataaars-neutral'])

  return {
    id: v4(),
    firstName,
    lastName,
    password: '',
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    image: withImage ? `https://api.dicebear.com/9.x/${avatarStyle}/svg?seed=${firstName}` : undefined,
    createdAt: formatISO(new Date()),
  }
}
