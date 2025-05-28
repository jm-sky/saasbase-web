import api from '@/lib/api'
import type { IResource, IResourceCollection } from '@/domains/shared/types/resource.type'

export interface ITag {
  id: string
  name: string
  slug: string
}

export class TagService {
  static async index() {
    const response = await api.get<IResourceCollection<ITag>>('/tags')
    return response.data.data
  }

  static async create(tag: string) {
    const response = await api.post<IResource<ITag>>('/tags', { name: tag })
    return response.data.data
  }

  static async delete(tag: string) {
    await api.delete(`/tags/${tag}`)
  }
}
