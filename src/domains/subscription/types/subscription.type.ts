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
  planId: string;
  billingInterval: TBillingInterval;
  paymentDetails: PaymentDetails;
  trialEndsAt?: string;  // ISO date string
  couponCode?: string;   // max 50 chars
  metadata?: Record<string, string>;
}

export interface CreateCheckoutSessionRequest {
  planId: string
  billableType: 'tenant' | 'user'
  successUrl: string
  cancelUrl: string
}
