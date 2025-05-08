import type { PublicUser } from '@/domains/user/models/publicUser.model'

export interface IChatMessage {
  id: string
  userId: string
  user?: PublicUser
  content: string
  parentId: string
  createdAt: string
  editedAt: string
}

export interface IMessageSentEvent {
  data: IChatMessage
}

export interface IChatParticipant {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
}

export interface IChatRoom {
  id: string
  name: string
  type: string
  participants: IChatParticipant[]
}
