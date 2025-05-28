import api from '@/lib/api'
import { apiRoutesMap } from '@/lib/api/apiRoutes'
import type { TDateTime } from '@/domains/shared/types/common'
import type { IResourceCollection } from '@/domains/shared/types/resource.type'

export interface ITenantAttachment {
  id: string
  fileName: string
  size: number
  mimeType: string
  fileUrl: string
  collectionName: string
  createdAt: TDateTime
  updatedAt: TDateTime
}

class TenantAttachmentsService {
  async index(tenantId: string): Promise<IResourceCollection<ITenantAttachment>> {
    const response = (await api.get<IResourceCollection<ITenantAttachment>>(`${apiRoutesMap.tenants}/${tenantId}/attachments`)).data
    return response
  }

  async upload(tenantId: string, file: File): Promise<ITenantAttachment> {
    const formData = new FormData()
    formData.append('file', file)
    const response = (await api.post<{ data: ITenantAttachment }>(`${apiRoutesMap.tenants}/${tenantId}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })).data
    return response.data
  }

  async delete(tenantId: string, id: string): Promise<void> {
    await api.delete(`${apiRoutesMap.tenants}/${tenantId}/attachments/${id}`)
  }

  async download(tenantId: string, id: string): Promise<Blob> {
    const response = await api.get(`${apiRoutesMap.tenants}/${tenantId}/attachments/${id}/download`, { responseType: 'blob' })
    return response.data
  }
}

export const tenantAttachmentsService = new TenantAttachmentsService()
