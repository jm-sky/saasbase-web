import api from '@/lib/api'
import type { IUserSkill } from '@/domains/user/types/user.type'
import type { IResource, IResourceCollection } from '@/domains/shared/types/resource.type'

export interface IUserSkillCreate {
  userId: string
  skillId: string
  level: number
  acquiredAt?: string
}

export type IUserSkillUpdate = Partial<Omit<IUserSkillCreate, 'userId'>> // userId niepotrzebny w update

class UserSkillService {
  async index(userId: string): Promise<IResourceCollection<IUserSkill>> {
    const response = await api.get<IResourceCollection<IUserSkill>>(`/users/${userId}/skills`)
    return response.data
  }

  async show(userId: string, skillId: string): Promise<IUserSkill> {
    const response = await api.get<IResource<IUserSkill>>(`/users/${userId}/skills/${skillId}`)
    return response.data.data
  }

  async add(data: IUserSkillCreate): Promise<IUserSkill> {
    const response = await api.post<IResource<IUserSkill>>(`/users/${data.userId}/skills`, data)
    return response.data.data
  }

  async update(userId: string, skillId: string, data: IUserSkillUpdate): Promise<IUserSkill> {
    const response = await api.patch<IResource<IUserSkill>>(`/users/${userId}/skills/${skillId}`, data)
    return response.data.data
  }

  async delete(userId: string, skillId: string): Promise<void> {
    await api.delete(`/users/${userId}/skills/${skillId}`)
  }
}

export const userSkillService = new UserSkillService()
