import { type TDateTime } from '@/domains/shared/types/common'
import type { IUserPreview } from '@/domains/user/types/user.type'

export interface IComment {
  id: string
  userId: string
  content: string
  commentableId: string
  commentableType: string
  createdAt: TDateTime
  updatedAt: TDateTime
  user?: IUserPreview
  meta?: {
    canEdit: boolean
    canDelete: boolean
  }
}

export type ICommentCreate = Omit<IComment, 'id' | 'createdAt' | 'updatedAt'>

export type TCommentCreateFunction = (commentableId: string, content: string) => Promise<IComment>
export interface ICommentService {
  create: TCommentCreateFunction
}