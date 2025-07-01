import type { TDateTime } from '@/domains/shared/types/common'

export type TUserSessionType = 'jwt' | 'cookie'

export interface IUserSession {
  id: string
  type: TUserSessionType
  deviceName?: string
  userAgent?: string
  ipAddress?: string
  lastActiveAt: TDateTime
  expiresAt: TDateTime
  isCurrent: boolean
  isActive: boolean
}