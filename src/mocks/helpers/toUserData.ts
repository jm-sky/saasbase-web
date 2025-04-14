import type { MockUserStored } from '@/mocks/mock.type'
import type { IUserData } from '@/models/user.model'

export const toUserData = (mockUser: MockUserStored): IUserData => ({
  id: mockUser.id,
  firstName: mockUser.firstName,
  lastName: mockUser.lastName,
  email: mockUser.email,
  phone: mockUser.phone,
  birthDate: mockUser.birthDate,
  address: mockUser.address,
  image: undefined,
  createdAt: mockUser.createdAt,
})
