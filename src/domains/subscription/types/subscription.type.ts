import type { TDateTime, TUUID } from '@/domains/shared/types/common'

export interface IFeature {
  id: TUUID
  name: string
  description: string
  type: string
  value: string
  defaultValue: string
  createdAt: TDateTime
  updatedAt: TDateTime
}

export interface ISubscriptionPlan {
  id: TUUID
  name: string
  description: string
  price: number
  billingInterval: string
  stripeProductId: string
  stripePriceId: string
  features: IFeature[]
  // -----------------
  // To be implemented
  currency: string
  isCurrent: boolean
  // -----------------
  createdAt: TDateTime
  updatedAt: TDateTime
}