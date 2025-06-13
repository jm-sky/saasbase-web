import api from '@/lib/api'
import { apiRoutesMap } from '@/lib/api/apiRoutes'
import type { IResource } from '@/domains/shared/types/resource.type'
import type { IModelTagService, ITag } from '@/domains/tags/types/tag.type'

class ContractorTagsService implements IModelTagService {
  async create(contractorId: string, tag: string): Promise<ITag> {
    const response = (await api.post<IResource<ITag>>(`${apiRoutesMap.contractors}/${contractorId}/tags`, { tag })).data
    return response.data
  }

  async delete(contractorId: string, id: string): Promise<void> {
    await api.delete(`${apiRoutesMap.contractors}/${contractorId}/tags/${id}`)
  }
}

export const contractorTagsService = new ContractorTagsService()
