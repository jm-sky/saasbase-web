import type { TDateTime } from '@/domains/shared/types/common'

export interface AccountProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  avatar?: string
  company?: string
  position?: string
  timezone?: string
  language?: string
}

export interface AccountSettings {
  id: string
  emailNotifications: boolean
  marketingEmails: boolean
  securityAlerts: boolean
  twoFactorEnabled: boolean
  theme: 'light' | 'dark' | 'system'
  dataCollection: boolean
  analytics: boolean
  thirdPartySharing: boolean
  personalizedAds: boolean
  locationTracking: boolean
}

export interface AccountActivity {
  id: string
  type: string
  description: string
  timestamp: string
  ipAddress?: string
  device?: string
  location?: string
}

export interface ApiKey {
  id: string
  name: string
  key: string
  createdAt: TDateTime
  lastUsed?: TDateTime
  expiresAt?: TDateTime
}

export interface BillingPlan {
  id: string
  name: string
  price: number
  currency: string
  interval: 'month' | 'year'
  features: string[]
  isPopular?: boolean
}

export interface BillingHistory {
  id: string
  amount: number
  currency: string
  status: 'paid' | 'pending' | 'failed'
  date: string
  description: string
  invoiceUrl?: string
}
