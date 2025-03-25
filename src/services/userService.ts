import axios from '@/helpers/axios'
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
    const users = (await axios.get<{ users: IPublicUser[] }>('/api/users', { params })).data.users

    return users.map(user => this.publicUserToUser(user))
  }

  async get(id: string): Promise<User> {
    const user = (await axios.get<IPublicUser>(`/api/users/${id}`)).data

    return this.publicUserToUser(user)
  }
}

export const userService = new UserService()
