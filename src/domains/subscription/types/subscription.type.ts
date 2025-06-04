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
  billingInterval: string
  stripeProductId: string
  stripePriceId: string
  features: IFeature[]
  isActive: boolean
  createdAt: TDateTime
  updatedAt: TDateTime
}

export interface ISubscriptionPlanDiscount {
  amount: number
  interval: TBillingInterval
}

export interface PaymentDetails {
  cardNumber: string;  // 16 digits
  expiry: string;      // MM/YY format
  cvc: string;         // 3-4 digits
  name: string;        // max 255 chars
}

export interface StoreSubscriptionRequest {
  planId: TUUID;
  billingInterval: TBillingInterval;
  paymentDetails: PaymentDetails;
  trialEndsAt?: string;  // ISO date string
  couponCode?: string;   // max 50 chars
  metadata?: Record<string, string>;
}

export interface CreateCheckoutSessionRequest {
  planId: TUUID
  priceId: TUUID
  billableType: 'tenant' | 'user'
  successUrl: string
  cancelUrl: string
}
