import type { TDateTime, TUUID } from './common'

export interface IMedia {
  id: TUUID
  collectionName: string
  fileName: string
  fileUrl: string
  mimeType: string
  size: number
  createdAt: TDateTime
  updatedAt: TDateTime
}