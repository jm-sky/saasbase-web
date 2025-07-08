
import api from '@/lib/api'
import { apiRoutesMap } from '@/lib/api/apiRoutes'
import type { IAttachment, IAttachmentService } from '@/domains/shared/types/attachment.type'
import type { TDateTime, TUUID } from '@/domains/shared/types/common'
import type { IResourceCollection } from '@/domains/shared/types/resource.type'

export interface IExpenseAttachment extends IAttachment {
  id: TUUID
  fileName: string
  size: number
  mimeType: string
  fileUrl: string
  collectionName: string
  createdAt: TDateTime
  updatedAt: TDateTime
}

class ExpenseAttachmentsService implements IAttachmentService {
  async index(expenseId: TUUID): Promise<IResourceCollection<IExpenseAttachment>> {
    const response = (await api.get<IResourceCollection<IExpenseAttachment>>(`${apiRoutesMap.expenses}/${expenseId}/attachments`)).data
    return response
  }

  async upload(expenseId: TUUID, file: File): Promise<IExpenseAttachment> {
    const formData = new FormData()
    formData.append('file', file)
    const response = (await api.post<{ data: IExpenseAttachment }>(`${apiRoutesMap.expenses}/${expenseId}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })).data
    return response.data
  }

  async delete(expenseId: TUUID, id: string): Promise<void> {
    await api.delete(`${apiRoutesMap.expenses}/${expenseId}/attachments/${id}`)
  }

  async download(expenseId: TUUID, id: string): Promise<Blob> {
    const response = await api.get(`${apiRoutesMap.expenses}/${expenseId}/attachments/${id}/download`, { responseType: 'blob' })
    return response.data
  }
}

export const expenseAttachmentsService = new ExpenseAttachmentsService()
