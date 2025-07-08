import type { IChatMessage } from '../types/chat.type'
import type { TDateTime } from '@/domains/shared/types/common'
import type { IUserPreview } from '@/domains/user/types/user.type'

export class ChatMessage implements IChatMessage {
  id: string
  tempId?: string
  userId: string
  user?: IUserPreview
  content: string
  parentId?: string
  createdAt: TDateTime
  editedAt?: TDateTime

  constructor(data: IChatMessage) {
    this.id = data.id ?? ''
    this.userId = data.userId
    this.user = data.user
    this.content = data.content
    this.parentId = data.parentId
    this.createdAt = data.createdAt
    this.editedAt = data.editedAt
  }

  static load(data: IChatMessage): ChatMessage {
    return new ChatMessage(data)
  }

  isSentBy(userId: string): boolean {
    return this.userId === userId
  }

  getVariant(userId: string): 'sent' | 'received' {
    return this.isSentBy(userId) ? 'sent' : 'received'
  }
}
