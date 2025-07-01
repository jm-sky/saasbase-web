import type { TDate, TDateTime } from '@/domains/shared/types/common'

export interface UserProfile {
  id: string
  userId: string
  avatarUrl?: string
  bio?: string
  location?: string
  birthDate?: string
  position?: string
  website?: string
  socialLinks?: Record<string, string>
  createdAt: TDateTime
  updatedAt: TDateTime
}

export interface UserPreference {
  id: string
  userId: string
  language: string
  decimalSeparator: string
  dateFormat: string
  darkMode: 'light' | 'dark' | 'system'
  isSoundEnabled: boolean
  isProfilePublic: boolean
  fieldVisibility?: Record<string, boolean>
  visibilityPerTenant?: Record<string, Record<string, boolean>>
  createdAt: TDateTime
  updatedAt: TDateTime
}

export interface UserTableSetting {
  id: string
  userId: string
  entity: string
  name?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: Record<string, any>
  isDefault: boolean
  createdAt: TDateTime
  updatedAt: TDateTime
}

export interface NotificationSetting {
  id: string
  userId: string
  channel: string
  settingKey: string
  enabled: boolean
  createdAt: TDateTime
  updatedAt: TDateTime
}

export interface TrustedDevice {
  id: string
  userId: string
  token: string
  deviceName: string
  browser: string
  os: string
  location?: string
  lastActiveAt: TDateTime
  ipAddress: string
  trustedUntil?: string
  createdAt: TDateTime
  updatedAt: TDateTime
}

export interface SecurityEvent {
  id: string
  userId: string
  eventType: string
  ipAddress: string
  createdAt: TDateTime
  updatedAt: TDateTime
}

// Request/Response types
export interface UpdateProfileRequest {
  avatarUrl?: string
  bio?: string
  location?: string
  birthDate?: TDate
  position?: string
  website?: string
  socialLinks?: Record<string, string>
}

export interface UpdatePreferenceRequest {
  language?: string
  decimalSeparator?: string
  dateFormat?: string
  darkMode?: 'light' | 'dark' | 'system'
  isSoundEnabled?: boolean
  isProfilePublic?: boolean
  fieldVisibility?: Record<string, boolean>
  visibilityPerTenant?: Record<string, Record<string, boolean>>
}

export interface CreateTableSettingRequest {
  entity: string
  name?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: Record<string, any>
  isDefault?: boolean
}

export interface UpdateTableSettingRequest {
  name?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config?: Record<string, any>
  isDefault?: boolean
}

export interface UpdateNotificationSettingRequest {
  enabled: boolean
}

export interface UpdateNotificationSettingsBulkRequest {
  settings: {
    channel: string
    settingKey: string
    enabled: boolean
  }[]
}
