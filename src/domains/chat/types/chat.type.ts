export interface IChatMessage {
  id: string
  userId: string
  content: string
  parentId: string
  createdAt: string
  editedAt: string
}

export interface IMessageSentEvent {
  data: IChatMessage
  message: IChatMessage
}

export interface IChatRoom {
  id: string
  name: string
  type: string
  participants: string[]
}
