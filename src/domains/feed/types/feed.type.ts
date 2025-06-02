import type { IComment } from '@/domains/comment/types/comment.type'
import type { TDateTime, TUUID } from '@/domains/shared/types/common'
import type { IUserPreview } from '@/domains/user/types/user.type'

export interface IFeed {
  id: TUUID
  tenantId: TUUID
  userId: TUUID
  title: string
  content: string
  createdAt: TDateTime
  updatedAt: TDateTime
  creator?: IUserPreview
  commentsCount?: number
  comments?: IComment[]
}

export type IFeedCreate = Pick<IFeed, 'title' | 'content'>
