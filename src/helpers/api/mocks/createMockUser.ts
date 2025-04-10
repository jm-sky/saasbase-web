import { faker } from '@faker-js/faker'
import { formatISO } from 'date-fns'
import { v4 } from 'uuid'
import type { MockUserStored } from '@/helpers/api/mocks/mock.type'
import type { RegistrationData } from '@/types/auth.type'

export const createMockUser = (data: RegistrationData): MockUserStored => {
  return {
    id: v4(),
    ...data,
    image: faker.helpers.arrayElement(['/avatars/01.png', '/avatars/02.png','/avatars/03.png', undefined]),
    password: btoa(data.password),
    createdAt: formatISO(new Date()),
  }
}
