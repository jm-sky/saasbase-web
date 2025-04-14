import type { IPublicUser, IUserStored } from '@/domains/user/types/user.type'

export const toPublicUser = (storedUser: IUserStored): IPublicUser => ({
  id: storedUser.id,
  firstName: storedUser.firstName,
  lastName: storedUser.lastName,
  email: storedUser.email,
  phone: storedUser.phone,
  description: storedUser.description,
  address: storedUser.address,
  image: storedUser.image,
  role: storedUser.role,
  createdAt: storedUser.createdAt,
})
