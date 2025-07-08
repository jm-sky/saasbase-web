import api from '@/lib/api'
import type { ITag, TTagColor } from '../types/tag.type'
import type { IResource, IResourceCollection } from '@/domains/shared/types/resource.type'

export class TagService {
  static async index() {
    const response = await api.get<IResourceCollection<ITag>>('/tags')
    return response.data.data
  }

  static async create(tag: string, color?: TTagColor) {
    const response = await api.post<IResource<ITag>>('/tags', { name: tag, color })
    return response.data.data
  }

  static async delete(tag: string) {
    await api.delete(`/tags/${tag}`)
  }
}
