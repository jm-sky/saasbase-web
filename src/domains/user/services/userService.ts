import { UserProfile } from '@/domains/user/models/userProfile.model'
import api from '@/lib/api'
import { apiRoutesMap } from '@/lib/api/apiRoutes'
import type { IUserPreview, IUserProfile } from '@/domains/user/types/user.type'

export interface IUserGetParams {
  limit?: number
}

class UserService {
  async index(params?: IUserGetParams): Promise<IUserPreview[]> {
    const users = (await api.get<{ data: IUserPreview[] }>(apiRoutesMap.users, { params })).data.data

    return users
  }

  async get(id: string): Promise<UserProfile> {
    const user = (await api.get<IUserProfile>(`/api/users/${id}`)).data

    return UserProfile.load(user)
  }
}

export const userService = new UserService()
