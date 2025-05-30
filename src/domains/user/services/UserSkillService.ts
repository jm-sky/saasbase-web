import api from '@/lib/api'
import type { IUserSkill } from '@/domains/user/types/user.type'
import type { IResource, IResourceCollection } from '@/domains/shared/types/resource.type'

export interface IUserSkillCreate {
  skillId: string
  level: number
  acquiredAt?: string
}

export type IUserSkillUpdate = Partial<IUserSkillCreate>

class UserSkillService {
  async index(): Promise<IResourceCollection<IUserSkill>> {
    const response = await api.get<IResourceCollection<IUserSkill>>('/user/skills')
    return response.data
  }

  async show(skillId: string): Promise<IUserSkill> {
    const response = await api.get<IResource<IUserSkill>>(`/user/skills/${skillId}`)
    return response.data.data
  }

  async add(data: IUserSkillCreate): Promise<IUserSkill> {
    const response = await api.post<IResource<IUserSkill>>('/user/skills', data)
    return response.data.data
  }

  async update(skillId: string, data: IUserSkillUpdate): Promise<IUserSkill> {
    const response = await api.patch<IResource<IUserSkill>>(`/user/skills/${skillId}`, data)
    return response.data.data
  }

  async delete(skillId: string): Promise<void> {
    await api.delete(`/user/skills/${skillId}`)
  }
}

export const userSkillService = new UserSkillService()
