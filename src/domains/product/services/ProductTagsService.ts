import api from '@/lib/api'
import { apiRoutesMap } from '@/lib/api/apiRoutes'
import type { IResource } from '@/domains/shared/types/resource.type'
import type { IModelTagService, ITag } from '@/domains/tags/types/tag.type'

class ProductTagsService implements IModelTagService {
  async create(productId: string, tag: string): Promise<ITag> {
    const response = (await api.post<IResource<ITag>>(`${apiRoutesMap.products}/${productId}/tags`, { tag })).data
    return response.data
  }

  async delete(productId: string, id: string): Promise<void> {
    await api.delete(`${apiRoutesMap.products}/${productId}/tags/${id}`)
  }
}

export const productTagsService = new ProductTagsService()
