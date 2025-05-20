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
  createdAt: string
  updatedAt: string
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
  createdAt: string
  updatedAt: string
}

export interface UserTableSetting {
  id: string
  userId: string
  entity: string
  name?: string
  config: Record<string, any>
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface NotificationSetting {
  id: string
  userId: string
  channel: string
  settingKey: string
  enabled: boolean
  createdAt: string
  updatedAt: string
}

export interface TrustedDevice {
  id: string
  userId: string
  token: string
  deviceName: string
  browser: string
  os: string
  location?: string
  lastActiveAt: string
  ipAddress: string
  trustedUntil?: string
  createdAt: string
  updatedAt: string
}

export interface SecurityEvent {
  id: string
  userId: string
  eventType: string
  ipAddress: string
  createdAt: string
  updatedAt: string
}

// Request/Response types
export interface UpdateProfileRequest {
  avatarUrl?: string
  bio?: string
  location?: string
  birthDate?: string
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
  config: Record<string, any>
  isDefault?: boolean
}

export interface UpdateTableSettingRequest {
  name?: string
  config?: Record<string, any>
  isDefault?: boolean
}

export interface UpdateNotificationSettingRequest {
  enabled: boolean
}

export interface UpdateNotificationSettingsBulkRequest {
  settings: Array<{
    channel: string
    settingKey: string
    enabled: boolean
  }>
}
