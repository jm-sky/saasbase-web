import { type ITag, Tag } from '@/domains/shared/types/tag.model'
import api from '@/lib/api'
import { apiRoutesMap } from '@/lib/api/apiRoutes'

export interface ITagGetParams {
  limit?: number
  offset?: number
}

class TagService {
  async index(params?: ITagGetParams): Promise<Tag[]> {
    const response = await api.get<{ data: ITag[] }>(apiRoutesMap.tags, { params })
    return response.data.data.map(data => Tag.load(data))
  }

  async get(id: string): Promise<Tag> {
    const response = await api.get<{ data: ITag }>(`${apiRoutesMap.tags}/${id}`)
    return Tag.load(response.data.data)
  }

  async create(tag: Omit<ITag, 'id' | 'createdAt' | 'updatedAt'>): Promise<Tag> {
    const response = await api.post<{ data: ITag }>(apiRoutesMap.tags, tag)
    return Tag.load(response.data.data)
  }

  async update(id: string, tag: Partial<ITag>): Promise<Tag> {
    const response = await api.patch<{ data: ITag }>(`${apiRoutesMap.tags}/${id}`, tag)
    return Tag.load(response.data.data)
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${apiRoutesMap.tags}/${id}`)
  }
}

export const tagService = new TagService()
