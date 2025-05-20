import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import type { AccountActivity, AccountProfile, AccountSettings } from '../types'

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms))

export interface Device {
  id: string
  name: string
  type: string
  lastActive: string
  location: string
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

export interface UserSession {
  id: string
  deviceName: string
  deviceType: 'desktop' | 'mobile' | 'tablet'
  location: string
  ip: string
  lastActive: string
  isCurrent: boolean
}

export interface ApiKey {
  id: string
  name: string
  createdAt: string
  expiresAt: string
  lastUsedAt?: string
  isActive: boolean
}

export interface CreateApiKeyData {
  name: string
  expiresAt: string
}

export interface BillingPlan {
  id: string
  name: string
  description: string
  price: number
  currency: string
  interval: 'month' | 'year'
  features: string[]
  isCurrent: boolean
  isPopular?: boolean
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

  async getProfile(): Promise<AccountProfile> {
    try {
      await this.delay()
      // TODO: Replace with actual API call
      return {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      }
    } catch (error) {
      handleErrorWithToast('Failed to fetch profile', error)
      throw error
    }
  }

  async updateProfile(data: Partial<AccountProfile>): Promise<AccountProfile> {
    try {
      await this.delay()
      // TODO: Replace with actual API call
      return {
        id: '1',
        firstName: data.firstName ?? 'John',
        lastName: data.lastName ?? 'Doe',
        email: data.email ?? 'john.doe@example.com',
        avatar: data.avatar,
      }
    } catch (error) {
      handleErrorWithToast('Failed to update profile', error)
      throw error
    }
  }

  async getSettings(): Promise<AccountSettings> {
    try {
      await this.delay()
      // TODO: Replace with actual API call
      return {
        id: '1',
        emailNotifications: true,
        marketingEmails: false,
        securityAlerts: true,
        twoFactorEnabled: false,
        theme: 'light',
        dataCollection: true,
        analytics: true,
        thirdPartySharing: false,
        personalizedAds: false,
        locationTracking: false,
      }
    } catch (error) {
      handleErrorWithToast('Failed to fetch settings', error)
      throw error
    }
  }

  async updateSettings(data: Partial<AccountSettings>): Promise<AccountSettings> {
    try {
      await this.delay()
      // TODO: Replace with actual API call
      return {
        id: '1',
        emailNotifications: data.emailNotifications ?? true,
        marketingEmails: data.marketingEmails ?? false,
        securityAlerts: data.securityAlerts ?? true,
        twoFactorEnabled: data.twoFactorEnabled ?? false,
        theme: data.theme ?? 'light',
        dataCollection: data.dataCollection ?? true,
        analytics: data.analytics ?? true,
        thirdPartySharing: data.thirdPartySharing ?? false,
        personalizedAds: data.personalizedAds ?? false,
        locationTracking: data.locationTracking ?? false,
      }
    } catch (error) {
      handleErrorWithToast('Failed to update settings', error)
      throw error
    }
  }

  async getActivity(): Promise<AccountActivity[]> {
    try {
      await this.delay()
      // TODO: Replace with actual API call
      return []
    } catch (error) {
      handleErrorWithToast('Failed to fetch activity', error)
      throw error
    }
  }

  async getApiKeys(): Promise<ApiKey[]> {
    try {
      await this.delay()
      // TODO: Replace with actual API call
      return [
        {
          id: '1',
          name: 'Production API Key',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
          expiresAt: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000).toISOString(), // 23 days from now
          lastUsedAt: new Date().toISOString(),
          isActive: true,
        },
        {
          id: '2',
          name: 'Development API Key',
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          isActive: true,
        },
      ]
    } catch (error) {
      handleErrorWithToast('Failed to fetch API keys', error)
      throw error
    }
  }

  async createApiKey(data: CreateApiKeyData): Promise<ApiKey> {
    try {
      await this.delay()
      // TODO: Replace with actual API call
      return {
        id: Math.random().toString(36).substring(7),
        name: data.name,
        createdAt: new Date().toISOString(),
        expiresAt: data.expiresAt,
        isActive: true,
      }
    } catch (error) {
      handleErrorWithToast('Failed to create API key', error)
      throw error
    }
  }

  async revokeApiKey(keyId: string): Promise<void> {
    try {
      await this.delay()
      // TODO: Replace with actual API call
      console.log('Revoking API key:', keyId)
    } catch (error) {
      handleErrorWithToast('Failed to revoke API key', error)
      throw error
    }
  }

  async getBillingPlans(): Promise<BillingPlan[]> {
    try {
      await this.delay()
      // TODO: Replace with actual API call
      return [
        {
          id: '1',
          name: 'Starter',
          description: 'Perfect for small teams and individuals',
          price: 29,
          currency: 'USD',
          interval: 'month',
          features: [
            '5 team members',
            '100GB storage',
            '50,000 API calls',
            'Basic support',
          ],
          isCurrent: false,
        },
        {
          id: '2',
          name: 'Professional',
          description: 'Best for growing businesses',
          price: 99,
          currency: 'USD',
          interval: 'month',
          features: [
            '20 team members',
            '500GB storage',
            '200,000 API calls',
            'Priority support',
            'Advanced analytics',
          ],
          isCurrent: true,
          isPopular: true,
        },
        {
          id: '3',
          name: 'Enterprise',
          description: 'For large organizations with advanced needs',
          price: 299,
          currency: 'USD',
          interval: 'month',
          features: [
            'Unlimited team members',
            '2TB storage',
            '1,000,000 API calls',
            '24/7 support',
            'Advanced analytics',
            'Custom integrations',
            'SLA guarantee',
          ],
          isCurrent: false,
        },
      ]
    } catch (error) {
      handleErrorWithToast('Failed to fetch billing plans', error)
      throw error
    }
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
    // TODO: Implement API call
    await delay()
    return [
      {
        id: '1',
        name: 'MacBook Pro',
        type: 'Desktop',
        lastActive: '2024-03-20T10:30:00Z',
        location: 'New York, USA',
        isCurrent: true,
      },
      {
        id: '2',
        name: 'iPhone 13',
        type: 'Mobile',
        lastActive: '2024-03-20T09:15:00Z',
        location: 'New York, USA',
        isCurrent: false,
      },
    ]
  }

  async getSecurityLog(): Promise<SecurityLog[]> {
    // TODO: Implement API call
    await delay()
    return [
      {
        id: '1',
        type: 'login',
        timestamp: '2024-03-20T10:30:00Z',
        ip: '192.168.1.1',
        location: 'New York, USA',
        device: 'MacBook Pro',
        status: 'success',
      },
      {
        id: '2',
        type: 'password_change',
        timestamp: '2024-03-19T15:45:00Z',
        ip: '192.168.1.1',
        location: 'New York, USA',
        device: 'MacBook Pro',
        status: 'success',
      },
      {
        id: '3',
        type: '2fa_enabled',
        timestamp: '2024-03-18T09:15:00Z',
        ip: '192.168.1.1',
        location: 'New York, USA',
        device: 'iPhone 13',
        status: 'success',
      },
    ]
  }

  async getSessions(): Promise<UserSession[]> {
    try {
      await this.delay()
      // TODO: Replace with actual API call
      return [
        {
          id: '1',
          deviceName: 'MacBook Pro',
          deviceType: 'desktop',
          location: 'New York, USA',
          ip: '192.168.1.1',
          lastActive: new Date().toISOString(),
          isCurrent: true,
        },
        {
          id: '2',
          deviceName: 'iPhone 13',
          deviceType: 'mobile',
          location: 'New York, USA',
          ip: '192.168.1.2',
          lastActive: new Date(Date.now() - 3600000).toISOString(),
          isCurrent: false,
        },
      ]
    } catch (error) {
      handleErrorWithToast('Failed to fetch sessions', error)
      throw error
    }
  }

  async terminateSession(sessionId: string): Promise<void> {
    try {
      await this.delay()
      // TODO: Replace with actual API call
      console.log('Terminating session:', sessionId)
    } catch (error) {
      handleErrorWithToast('Failed to terminate session', error)
      throw error
    }
  }

  async terminateAllSessions(): Promise<void> {
    try {
      await this.delay()
      // TODO: Replace with actual API call
    } catch (error) {
      handleErrorWithToast('Failed to terminate all sessions', error)
      throw error
    }
  }
}

export const accountService = new AccountService()
