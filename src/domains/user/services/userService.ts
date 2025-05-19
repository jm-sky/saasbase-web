import { UserPreview } from '@/domains/user/models/publicUser.model'
import api from '@/lib/api'
import { apiRoutesMap } from '@/lib/api/apiRoutes'
import type { IUserPreview } from '@/domains/user/types/user.type'

export interface IUserGetParams {
  limit?: number
}

class UserService {
  async index(params?: IUserGetParams): Promise<UserPreview[]> {
    const users = (await api.get<{ data: IUserPreview[] }>(apiRoutesMap.users, { params })).data.data

    return users.map(user => UserPreview.load(user))
  }

  async get(id: string): Promise<UserPreview> {
    const user = (await api.get<IUserPreview>(`/api/users/${id}`)).data

    return UserPreview.load(user)
  }
}

export const userService = new UserService()
