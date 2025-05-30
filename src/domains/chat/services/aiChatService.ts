import api from '@/lib/api'
import type { IResource } from '@/domains/shared/types/resource.type'

interface IChatResponse {
  id: string
  content: string
  streaming: boolean
}

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

  async sendMessage(message: string): Promise<IChatResponse> {
    const response = (await api.post<IResource<IChatResponse>>('/ai/chat', { message })).data.data
    return response
  }

  async stopStream(threadId?: string) {
    const response = (await api.post('/ai/chat/stop', { threadId })).data
    return response
  }
}

export const aiChatService = new AiChatService()