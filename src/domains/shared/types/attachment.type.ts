import type { TDateTime, TUUID } from './common'
import type { IResourceCollection } from './resource.type'

export interface IAttachmentMeta {
  isOcr?: boolean
}

export interface IAttachment {
  id: TUUID
  fileName: string
  size: number
  mimeType: string
  fileUrl: string
  collectionName: string
  meta?: IAttachmentMeta | null
  createdAt: TDateTime
  updatedAt: TDateTime
}

export interface IAttachmentService {
  index: (modelId: TUUID) => Promise<IResourceCollection<IAttachment>>
  upload: (modelId: TUUID, file: File) => Promise<IAttachment>
  delete: (modelId: TUUID, attachmentId: TUUID) => Promise<void>
  download: (modelId: TUUID, attachmentId: TUUID) => Promise<Blob>
}