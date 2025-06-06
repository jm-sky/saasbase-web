import type { TDateTime } from '@/domains/shared/types/common'
import type { IUserPreview } from '@/domains/user/types/user.type'

export interface IChatMessage {
  id?: string
  tempId?: string
  userId: string
  user?: IUserPreview
  content: string
  parentId?: string
  createdAt: TDateTime
  editedAt?: TDateTime
}

export interface IMessageSentEvent {
  data: IChatMessage
}

// UserPreview
export interface IChatParticipant {
  id: string
  name: string
  email?: string
  phone?: string
  avatarUrl?: string
}

export interface IChatRoom {
  id: string
  name: string
  type: string
  participants: IChatParticipant[]
}
