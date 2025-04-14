import api from '@/helpers/api'
import { apiRoutesMap } from '@/helpers/api/apiRoutes'
import { type ITag, Tag } from '@/models/tag.model'

export interface ITagGetParams {
  limit?: number
  offset?: number
}

class TagService {
  async index(params?: ITagGetParams): Promise<Tag[]> {
    const response = await api.get<{ tags: ITag[] }>(apiRoutesMap.tags, { params })
    return response.data.tags.map(data => Tag.load(data))
  }

  async get(id: string): Promise<Tag> {
    const response = await api.get<ITag>(`${apiRoutesMap.tags}/${id}`)
    return Tag.load(response.data)
  }

  async create(tag: Omit<ITag, 'id'>): Promise<Tag> {
    const response = await api.post<ITag>(apiRoutesMap.tags, tag)
    return Tag.load(response.data)
  }

  async update(id: string, tag: Partial<ITag>): Promise<Tag> {
    const response = await api.patch<ITag>(`${apiRoutesMap.tags}/${id}`, tag)
    return Tag.load(response.data)
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${apiRoutesMap.tags}/${id}`)
  }
}

export const tagService = new TagService()
