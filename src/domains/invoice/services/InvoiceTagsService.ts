import api from '@/lib/api'
import { apiRoutesMap } from '@/lib/api/apiRoutes'
import type { IResource } from '@/domains/shared/types/resource.type'
import type { IModelTagService, ITag } from '@/domains/tags/types/tag.type'

class InvoiceTagsService implements IModelTagService {
  async create(invoiceId: string, tag: string): Promise<ITag> {
    const response = (await api.post<IResource<ITag>>(`${apiRoutesMap.invoices}/${invoiceId}/tags`, { tag })).data
    return response.data
  }

  async delete(invoiceId: string, id: string): Promise<void> {
    await api.delete(`${apiRoutesMap.invoices}/${invoiceId}/tags/${id}`)
  }
}

export const invoiceTagsService = new InvoiceTagsService()
