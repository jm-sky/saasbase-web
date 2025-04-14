import { apiRoutesMap } from '@/composables/api/apiRoutes'
import api from '@/helpers/api'
import { type ISkill, Skill } from '@/models/skill.model'

export interface ISkillGetParams {
  categoryId?: string
  limit?: number
  offset?: number
}

class SkillService {
  async index(params?: ISkillGetParams): Promise<Skill[]> {
    const response = await api.get<{ skills: ISkill[] }>(apiRoutesMap.skills, { params })
    return response.data.skills.map(data => Skill.load(data))
  }

  async get(id: string): Promise<Skill> {
    const response = await api.get<ISkill>(`${apiRoutesMap.skills}/${id}`)
    return Skill.load(response.data)
  }

  async create(skill: Omit<ISkill, 'id'>): Promise<Skill> {
    const response = await api.post<ISkill>(apiRoutesMap.skills, skill)
    return Skill.load(response.data)
  }

  async update(id: string, skill: Partial<ISkill>): Promise<Skill> {
    const response = await api.patch<ISkill>(`${apiRoutesMap.skills}/${id}`, skill)
    return Skill.load(response.data)
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${apiRoutesMap.skills}/${id}`)
  }
}

export const skillService = new SkillService()
