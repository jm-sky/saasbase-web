import type { TDateTime } from '@/domains/shared/types/common'

export interface ActivityLog<TEvent extends string = string, TProps extends object = Record<string, unknown>> {
  id: number
  logName: string
  description: string
  properties: TProps
  event: TEvent
  createdAt: TDateTime
  updatedAt: TDateTime
  causerId: number | null
  causerType: string | null
  subjectId: number
  subjectType: string
}
