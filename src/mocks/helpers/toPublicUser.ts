import type { MockUserStored } from '@/mocks/mock.type'
import type { IPublicUser } from '@/models/user.model'

export const toPublicUser = (mockUser: MockUserStored): IPublicUser => ({
  id: mockUser.id,
  firstName: mockUser.firstName,
  lastName: mockUser.lastName,
  email: mockUser.email,
  phone: mockUser.phone,
  address: mockUser.address,
  image: undefined,
})
