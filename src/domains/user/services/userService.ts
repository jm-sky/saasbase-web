import { PublicUser } from '@/domains/user/models/publicUser.model'
import api from '@/lib/api'
import { apiRoutesMap } from '@/lib/api/apiRoutes'
import type { IPublicUser } from '@/domains/user/types/user.type'

export interface IUserGetParams {
  limit?: number
}

class UserService {
  async index(params?: IUserGetParams): Promise<PublicUser[]> {
    const users = (await api.get<{ data: IPublicUser[] }>(apiRoutesMap.users, { params })).data.data

    return users.map(user => PublicUser.load(user))
  }

  async get(id: string): Promise<PublicUser> {
    const user = (await api.get<IPublicUser>(`/api/users/${id}`)).data

    return PublicUser.load(user)
  }
}

export const userService = new UserService()
