import api from '@/lib/api'
import { apiRoutesMap } from '@/lib/api/apiRoutes'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'

export interface Device {
  id: string
  deviceName: string | null
  userAgent: string | null
  ipAddress: string | null
  lastActiveAt: string
  isCurrent: boolean
}

export interface SecurityLog {
  id: string
  type: 'login' | 'logout' | 'password_change' | '2fa_enabled' | '2fa_disabled' | 'device_added' | 'device_removed'
  timestamp: string
  ip: string
  location: string
  device: string
  status: 'success' | 'failed'
}

export interface BillingHistory {
  id: string
  date: string
  description: string
  planName: string
  amount: number
  currency: string
  status: 'paid' | 'pending' | 'failed'
  invoiceId?: string
}

export class AccountService {
  async delay(ms = 500): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  async getBillingHistory(): Promise<BillingHistory[]> {
    try {
      await this.delay()
      // TODO: Replace with actual API call
      return [
        {
          id: '1',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
          description: 'Professional Plan - Monthly',
          planName: 'Professional',
          amount: 99,
          currency: 'USD',
          status: 'paid',
          invoiceId: 'INV-001',
        },
        {
          id: '2',
          date: new Date(Date.now() - 37 * 24 * 60 * 60 * 1000).toISOString(), // 37 days ago
          description: 'Professional Plan - Monthly',
          planName: 'Professional',
          amount: 99,
          currency: 'USD',
          status: 'paid',
          invoiceId: 'INV-002',
        },
        {
          id: '3',
          date: new Date(Date.now() - 67 * 24 * 60 * 60 * 1000).toISOString(), // 67 days ago
          description: 'Starter Plan - Monthly',
          planName: 'Starter',
          amount: 29,
          currency: 'USD',
          status: 'paid',
          invoiceId: 'INV-003',
        },
      ]
    } catch (error) {
      handleErrorWithToast('Failed to fetch billing history', error)
      throw error
    }
  }

  async inviteFriend(data: { email: string; message?: string }): Promise<void> {
    try {
      await this.delay()
      // TODO: Replace with actual API call
      console.log('Inviting friend:', data)
    } catch (error) {
      handleErrorWithToast('Failed to invite friend', error)
      throw error
    }
  }

  async getDevices(): Promise<Device[]> {
    try {
      const response = await api.get<{ data: Device[] }>(apiRoutesMap.authSessions)
      return response.data.data
    } catch (error) {
      handleErrorWithToast('Failed to fetch devices', error)
      throw error
    }
  }

  async terminateSession(sessionId: string): Promise<void> {
    try {
      await api.delete(`${apiRoutesMap.authSessions}/${sessionId}`)
    } catch (error) {
      handleErrorWithToast('Failed to terminate session', error)
      throw error
    }
  }

  async terminateAllSessions(): Promise<void> {
    try {
      await api.post(`${apiRoutesMap.authSessions}/revoke-others`)
    } catch (error) {
      handleErrorWithToast('Failed to terminate all sessions', error)
      throw error
    }
  }
}

export const accountService = new AccountService()
