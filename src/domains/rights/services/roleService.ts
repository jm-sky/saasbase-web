import api from '@/lib/api'
import type { IResourceCollection } from '@/domains/shared/types/resource.type'

export interface IRole {
  id: string
  name: string
  permissions: string[]
}


class RoleService {
  async list(): Promise<IRole[]> {
    const response = await api.get<IResourceCollection<IRole>>('/roles')
    return response.data.data
  }
}

export const roleService = new RoleService()
