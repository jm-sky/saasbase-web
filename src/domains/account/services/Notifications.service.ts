import api from '@/lib/api'
import type { TDateTime, TUUID } from '@/domains/shared/types/common'
import type { IResource } from '@/domains/shared/types/resource.type'

export type TNotificationType = 'welcome' | 'security.passwordChanged'

export interface INotificationData {
  type: TNotificationType
  title: string
  message: string
  source: string
}

export interface INotification<T extends object = INotificationData> {
  id: TUUID
  data: T
  readAt?: TDateTime
  createdAt: TDateTime
  updatedAt: TDateTime
}

export class NotificationsService {
  async getNotifications<T extends object = INotificationData>() {
    const response = await api.get<IResource<INotification<T>>>('/notifications')
    return response.data.data
  }

  async markAsRead(ids: TUUID[]): Promise<void> {
    await api.post('/notifications/mark-as-read', { ids })
  }

  async archive(ids: TUUID[]): Promise<void> {
    await api.post('/notifications/archive', { ids })
  }
}

export const notificationsService = new NotificationsService()
