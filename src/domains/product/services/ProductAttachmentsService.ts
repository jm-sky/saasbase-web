import api from '@/lib/api'
import { apiRoutesMap } from '@/lib/api/apiRoutes'
import type { TDateTime } from '@/domains/shared/types/common'
import type { IResource } from '@/domains/shared/types/resource.type'

export interface IProductAttachment {
  id: string
  fileName: string
  size: number
  mimeType: string
  fileUrl: string
  collectionName: string
  createdAt: TDateTime
  updatedAt: TDateTime
}

class ProductAttachmentsService {
  async index(productId: string): Promise<IResource<IProductAttachment>> {
    const response = (await api.get<IResource<IProductAttachment>>(`${apiRoutesMap.products}/${productId}/attachments`)).data
    return response
  }

  async upload(productId: string, file: File): Promise<IProductAttachment> {
    const formData = new FormData()
    formData.append('file', file)
    const response = (await api.post<{ data: IProductAttachment }>(`${apiRoutesMap.products}/${productId}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })).data
    return response.data
  }

  async delete(productId: string, id: string): Promise<void> {
    await api.delete(`${apiRoutesMap.products}/${productId}/attachments/${id}`)
  }

  async download(productId: string, id: string): Promise<Blob> {
    const response = await api.get(`${apiRoutesMap.products}/${productId}/attachments/${id}/download`, { responseType: 'blob' })
    return response.data
  }
}

export const productAttachmentsService = new ProductAttachmentsService()
