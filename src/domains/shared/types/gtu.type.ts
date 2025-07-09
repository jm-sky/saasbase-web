import type { TDate, TDateTime } from './common'

export interface IGTU {
  id: string
  code: string
  name: string
  description?: string
  amountThresholdPln?: number
  applicableConditions?: string
  isActive: boolean
  effectiveFrom: TDate
  effectiveTo?: TDate
  createdAt: TDateTime
  updatedAt: TDateTime
}
