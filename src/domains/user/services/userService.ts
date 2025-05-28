import api from '@/lib/api'
import { apiRoutesMap } from '@/lib/api/apiRoutes'
import type { IResource, IResourceCollection } from '@/domains/shared/types/resource.type'
import type { IUserPreview, IUserProfileLegacy } from '@/domains/user/types/user.type'

export interface IUserGetParams {
  limit?: number
}

class UserService {
  async index(params?: IUserGetParams): Promise<IUserPreview[]> {
    const users = (await api.get<IResourceCollection<IUserPreview>>(apiRoutesMap.users, { params })).data.data

    return users
  }

  async get(id: string): Promise<IUserProfileLegacy> {
    const user = (await api.get<IResource<IUserProfileLegacy>>(`/users/${id}`)).data

    return user.data
  }
}

export const userService = new UserService()
