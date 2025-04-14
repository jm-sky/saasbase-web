import type { IUser, IUserStored } from '@/domains/user/types/user.type'

export const toUserData = (storedUser: IUserStored): IUser => ({
  id: storedUser.id,
  firstName: storedUser.firstName,
  lastName: storedUser.lastName,
  email: storedUser.email,
  phone: storedUser.phone,
  birthDate: storedUser.birthDate,
  description: storedUser.description,
  image: storedUser.image,
  role: storedUser.role,
  isEmailVerified: storedUser.isEmailVerified,
  lastLoginAt: storedUser.lastLoginAt,
  createdAt: storedUser.createdAt,
  updatedAt: storedUser.updatedAt,
})
