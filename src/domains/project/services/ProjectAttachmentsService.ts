import api from '@/lib/api'
import { apiRoutesMap } from '@/lib/api/apiRoutes'
import type { TDateTime } from '@/domains/shared/types/common'
import type { IResourceCollection } from '@/domains/shared/types/resource.type'

export interface IProjectAttachment {
  id: string
  fileName: string
  size: number
  mimeType: string
  fileUrl: string
  collectionName: string
  createdAt: TDateTime
  updatedAt: TDateTime
}

class ProjectAttachmentsService {
  async index(projectId: string): Promise<IResourceCollection<IProjectAttachment>> {
    const response = (await api.get<IResourceCollection<IProjectAttachment>>(`${apiRoutesMap.projects}/${projectId}/attachments`)).data
    return response
  }

  async upload(projectId: string, file: File): Promise<IProjectAttachment> {
    const formData = new FormData()
    formData.append('file', file)
    const response = (await api.post<{ data: IProjectAttachment }>(`${apiRoutesMap.projects}/${projectId}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })).data
    return response.data
  }

  async delete(projectId: string, id: string): Promise<void> {
    await api.delete(`${apiRoutesMap.projects}/${projectId}/attachments/${id}`)
  }

  async download(projectId: string, id: string): Promise<Blob> {
    const response = await api.get(`${apiRoutesMap.projects}/${projectId}/attachments/${id}/download`, { responseType: 'blob' })
    return response.data
  }
}

export const projectAttachmentsService = new ProjectAttachmentsService()
