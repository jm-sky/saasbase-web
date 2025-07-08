import { buildSpatieQuery } from '@/domains/shared/helpers/filtering'
import { type ISkill } from '@/domains/skill/models/skill.model'
import api from '@/lib/api'
import { apiRoutesMap } from '@/lib/api/apiRoutes'
import type { SortingState } from '@tanstack/vue-table'
import type { FilterDefinition, IResource, IResourceCollection } from '@/domains/shared/types/resource.type'

export interface ISkillFilters {
  search?: string
  page?: number
  perPage?: number
  filter?: Record<string, FilterDefinition>
  sort?: SortingState
}

class SkillService {
  async index(filters?: ISkillFilters): Promise<IResourceCollection<ISkill>> {
    const params = buildSpatieQuery(filters ?? { filter: {} })
    const response = await api.get<IResourceCollection<ISkill>>(apiRoutesMap.skills, { params })
    return response.data
  }

  async get(id: string): Promise<ISkill> {
    const response = await api.get<IResource<ISkill>>(`${apiRoutesMap.skills}/${id}`)
    return response.data.data
  }

  async create(skill: Omit<ISkill, 'id' | 'createdAt' | 'updatedAt'>): Promise<ISkill> {
    const response = await api.post<IResource<ISkill>>(apiRoutesMap.skills, skill)
    return response.data.data
  }

  async update(id: string, skill: Partial<ISkill>): Promise<ISkill> {
    const response = await api.patch<IResource<ISkill>>(`${apiRoutesMap.skills}/${id}`, skill)
    return response.data.data
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${apiRoutesMap.skills}/${id}`)
  }
}

export const skillService = new SkillService()
