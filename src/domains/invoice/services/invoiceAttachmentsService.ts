
import api from '@/lib/api'
import { apiRoutesMap } from '@/lib/api/apiRoutes'
import type { IAttachment, IAttachmentService } from '@/domains/shared/types/attachment.type'
import type { TDateTime, TUUID } from '@/domains/shared/types/common'
import type { IResourceCollection } from '@/domains/shared/types/resource.type'

export interface IInvoiceAttachment extends IAttachment {
  id: TUUID
  fileName: string
  size: number
  mimeType: string
  fileUrl: string
  collectionName: string
  createdAt: TDateTime
  updatedAt: TDateTime
}

class InvoiceAttachmentsService implements IAttachmentService {
  async index(invoiceId: TUUID): Promise<IResourceCollection<IInvoiceAttachment>> {
    const response = (await api.get<IResourceCollection<IInvoiceAttachment>>(`${apiRoutesMap.invoices}/${invoiceId}/attachments`)).data
    return response
  }

  async upload(invoiceId: TUUID, file: File): Promise<IInvoiceAttachment> {
    const formData = new FormData()
    formData.append('file', file)
    const response = (await api.post<{ data: IInvoiceAttachment }>(`${apiRoutesMap.invoices}/${invoiceId}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })).data
    return response.data
  }

  async delete(invoiceId: TUUID, mediaId: string): Promise<void> {
    await api.delete(`${apiRoutesMap.invoices}/${invoiceId}/attachments/${mediaId}`)
  }

  async download(invoiceId: TUUID, mediaId: string): Promise<Blob> {
    const response = await api.get(`${apiRoutesMap.invoices}/${invoiceId}/attachments/${mediaId}/download`, { responseType: 'blob' })
    return response.data
  }
}

export const invoiceeAttachmentsService = new InvoiceAttachmentsService()
