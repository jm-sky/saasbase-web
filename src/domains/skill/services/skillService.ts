import { type ISkill, Skill } from '@/domains/skill/models/skill.model'
import api from '@/lib/api'
import { apiRoutesMap } from '@/lib/api/apiRoutes'

export interface ISkillGetParams {
  categoryId?: string
  limit?: number
  offset?: number
}

class SkillService {
  async index(params?: ISkillGetParams): Promise<Skill[]> {
    const response = await api.get<{ data: ISkill[] }>(apiRoutesMap.skills, { params })
    return response.data.data.map(data => Skill.load(data))
  }

  async get(id: string): Promise<Skill> {
    const response = await api.get<{ data: ISkill }>(`${apiRoutesMap.skills}/${id}`)
    return Skill.load(response.data.data)
  }

  async create(skill: Omit<ISkill, 'id' | 'createdAt' | 'updatedAt'>): Promise<Skill> {
    const response = await api.post<{ data: ISkill }>(apiRoutesMap.skills, skill)
    return Skill.load(response.data.data)
  }

  async update(id: string, skill: Partial<ISkill>): Promise<Skill> {
    const response = await api.patch<{ data: ISkill }>(`${apiRoutesMap.skills}/${id}`, skill)
    return Skill.load(response.data.data)
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${apiRoutesMap.skills}/${id}`)
  }
}

export const skillService = new SkillService()
