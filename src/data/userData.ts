import type { IUser } from '@/domains/user/types/user.type'

export const userData: IUser = {
  id: 'ff3a345f-fa3d-5b92-aab9-b79b193ed5fc',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@mail.com',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  role: 'user',
  isEmailVerified: true,
}
