import api from '@/lib/api'
import type { IUserSession } from '../types/userSession.type'
import type { IResourceCollection } from '@/domains/shared/types/resource.type'

class UserSessionsService {
  async index(): Promise<IResourceCollection<IUserSession>> {
    return (await api.get<IResourceCollection<IUserSession>>('/sessions')).data
  }

  async terminateSession(sessionId: string): Promise<void> {
    await api.delete(`/sessions/${sessionId}`)
  }

  async terminateAllSessions(): Promise<void> {
    await api.delete('/sessions')
  }
}

export const userSessionsService = new UserSessionsService()
