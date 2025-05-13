import api from '@/lib/api'

class AiChatService {
  // async index() {
  //   const response = (await api.get<{ data: IChatRoom[]}>('/chat/rooms')).data
  //   return response.data
  // }

  // async create(userId: string) {
  //   const response = (await api.post<{ data: IChatRoom}>('/chat/rooms', { userId })).data
  //   return response
  // }

  // async getMessages(roomId: string) {
  //   const response = (await api.get<{ data: IChatMessage[] }>(`/chat/rooms/${roomId}/messages`)).data
  //   return response.data
  // }

  async sendMessage(content: string) {
    const response = (await api.post('/ai/chat', { content })).data
    return response
  }

  async stopStream(threadId?: string) {
    const response = (await api.post('/ai/chat/stop', { threadId })).data
    return response
  }
}

export const aiChatService = new AiChatService()