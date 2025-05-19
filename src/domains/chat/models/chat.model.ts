import { UserPreview } from '@/domains/user/models/publicUser.model'
import type { IChatMessage } from '../types/chat.type'

export class ChatMessage implements IChatMessage {
  id: string
  userId: string
  user?: UserPreview
  content: string
  parentId?: string
  createdAt: string
  editedAt?: string

  constructor(data: IChatMessage) {
    this.id = data.id
    this.userId = data.userId
    this.user = data.user ? UserPreview.load(data.user) : undefined
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
