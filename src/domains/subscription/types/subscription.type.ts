import type { TDateTime, TUUID } from '@/domains/shared/types/common'

export type TBillingInterval = 'monthly' | 'quarterly' | 'yearly'

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

export interface IBillingPrice {
  id: TUUID
  stripePriceId: string
  billingPeriod: TBillingInterval
  price: number
  currency: string
  isActive: boolean
  createdAt: TDateTime
  updatedAt: TDateTime
}

export interface ISubscriptionPlan {
  id: TUUID
  name: string
  description: string
  prices: IBillingPrice[]
  features: IFeature[]
  isCurrent: boolean
  createdAt: TDateTime
  updatedAt: TDateTime
}

export interface ISubscriptionPlanDiscount {
  amount: number
  interval: TBillingInterval
}

export interface CreateCheckoutSessionRequest {
  planId: TUUID
  priceId: TUUID
  billableType: 'tenant' | 'user'
  successUrl: string
  cancelUrl: string
}
