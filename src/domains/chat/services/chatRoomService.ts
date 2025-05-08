import api from '@/lib/api'
import type { IChatRoom } from '../types/chat.type'

class ChatRoomService {
  async index() {
    const response = (await api.get<{ data: IChatRoom[]}>('/chat/rooms')).data
    return response.data
  }

  async create(userId: string) {
    const response = (await api.post('/chat/rooms', { userId })).data
    return response
  }

  async sendMessage(roomId: string, content: string) {
    const response = (await api.post(`/chat/rooms/${roomId}/messages`, { content })).data
    return response
  }
}

export const chatRoomService = new ChatRoomService()