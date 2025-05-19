import api from '@/lib/api'

export interface IRole {
  id: string
  name: string
  permissions: string[]
}


class RoleService {
  async list(): Promise<IRole[]> {
    const response = await api.get<{ data: IRole[] }>('/roles')
    return response.data.data
  }
}

export const roleService = new RoleService()
