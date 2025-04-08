import { faker } from '@faker-js/faker'
import { v4 } from 'uuid'
import type { IPublicUser } from '@/models/user.model'

/**
 * https://fakerjs.dev/api/helpers
 * https://www.dicebear.com/how-to-use/http-api/
 */
export const fakePublicUser = (withImage: boolean | undefined = undefined): IPublicUser => {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  const avatarStyle = faker.helpers.arrayElement(['adventurer', 'pixel-art', 'avataaars-neutral'])

  return {
    id: v4(),
    firstName,
    lastName,
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    image: withImage ? `https://api.dicebear.com/9.x/${avatarStyle}/svg?seed=${firstName}` : undefined,
  }
}
