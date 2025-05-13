import api from '@/lib/api'
import type { IChatMessage, IChatRoom } from '../types/chat.type'

class ChatRoomService {
  async index() {
    const rooms = (await api.get<{ data: IChatRoom[]}>('/chat/rooms')).data
    return rooms.data
  }

  async create(userId: string) {
    const room = (await api.post<{ data: IChatRoom}>('/chat/rooms', { userId })).data
    return room.data
  }

  async getMessages(roomId: string) {
    const messages = (await api.get<{ data: IChatMessage[] }>(`/chat/rooms/${roomId}/messages`)).data
    return messages.data
  }

  async sendMessage(roomId: string, content: string) {
    const message = (await api.post<{ data: IChatMessage }>(`/chat/rooms/${roomId}/messages`, { content })).data
    return message.data
  }
}

export const chatRoomService = new ChatRoomService()