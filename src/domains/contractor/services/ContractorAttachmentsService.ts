import api from '@/lib/api'
import { apiRoutesMap } from '@/lib/api/apiRoutes'
import type { IResource } from '@/domains/shared/types/resource.type'

export interface IContractorAttachment {
  id: string
  contractorId: string
  fileName: string
  fileSize: number
  mimeType: string
  url: string
  createdAt: string
}

class ContractorAttachmentsService {
  async index(contractorId: string): Promise<IResource<IContractorAttachment>> {
    const response = (await api.get<IResource<IContractorAttachment>>(`${apiRoutesMap.contractors}/${contractorId}/attachments`)).data
    return response
  }

  async upload(contractorId: string, file: File): Promise<IContractorAttachment> {
    const formData = new FormData()
    formData.append('file', file)
    const response = (await api.post<{ data: IContractorAttachment }>(`${apiRoutesMap.contractors}/${contractorId}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })).data
    return response.data
  }

  async delete(contractorId: string, id: string): Promise<void> {
    await api.delete(`${apiRoutesMap.contractors}/${contractorId}/attachments/${id}`)
  }

  async download(contractorId: string, id: string): Promise<Blob> {
    const response = await api.get(`${apiRoutesMap.contractors}/${contractorId}/attachments/${id}/download`, { responseType: 'blob' })
    return response.data
  }
}

export const contractorAttachmentsService = new ContractorAttachmentsService()
