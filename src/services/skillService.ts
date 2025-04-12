import api from '@/helpers/api'
import { apiRoutesMap } from '@/helpers/api/apiRoutes'
import { type ISkill, type TSkillLevel } from '@/models/skill.model'

export interface ISkillGetParams {
  categoryId?: string
  limit?: number
  offset?: number
}

class SkillService {
  async index(params?: ISkillGetParams): Promise<ISkill[]> {
    const response = await api.get<{ skills: ISkill[] }>(apiRoutesMap.skills, { params })
    return response.data.skills
  }

  async get(id: string): Promise<ISkill> {
    const response = await api.get<ISkill>(`${apiRoutesMap.skills}/${id}`)
    return response.data
  }

  async create(skill: Omit<ISkill, 'id'>): Promise<ISkill> {
    const response = await api.post<ISkill>(apiRoutesMap.skills, skill)
    return response.data
  }

  async update(id: string, skill: Partial<ISkill>): Promise<ISkill> {
    const response = await api.patch<ISkill>(`${apiRoutesMap.skills}/${id}`, skill)
    return response.data
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${apiRoutesMap.skills}/${id}`)
  }
}

export const skillService = new SkillService()
