import api from '@/helpers/api'
import { apiRoutesMap } from '@/helpers/api/apiRoutes'
import { type IPublicUser, User } from '@/models/user.model'

export interface IUserGetParams {
  limit?: number
}

class UserService {
  private publicUserToUser(publicUser: IPublicUser): User {
    return User.load({
      id: `${publicUser.id}`,
      name: publicUser.firstName,
      lastName: publicUser.lastName,
      email: publicUser.email,
      phone: publicUser.phone,
      birthDate: publicUser.birthDate,
      image: publicUser.image,
      address: publicUser.address ? {
        street: publicUser.address.address,
        city: publicUser.address.city,
        postalCode: publicUser.address.postalCode,
        country: publicUser.address.country,
      } : undefined,
      createdAt: new Date(),
    })
  }

  async index(params?: IUserGetParams): Promise<User[]> {
    const users = (await api.get<{ users: IPublicUser[] }>(apiRoutesMap.users, { params })).data.users

    return users.map(user => this.publicUserToUser(user))
  }

  async get(id: string): Promise<User> {
    const user = (await api.get<IPublicUser>(`/api/users/${id}`)).data

    return this.publicUserToUser(user)
  }
}

export const userService = new UserService()
