import api from '@/lib/api'
import type { CreateCheckoutSessionRequest, ISubscriptionPlan, StoreSubscriptionRequest } from '../types/subscription.type'
import type { TUUID } from '@/domains/shared/types/common'
import type { IResource, IResourceCollection } from '@/domains/shared/types/resource.type'

export interface ICreateCheckoutSessionResponse {
  checkoutUrl: string
  sessionId: string
}

class SubscriptionService {
  async index() {
    const response = await api.get<IResourceCollection<ISubscriptionPlan>>('/subscription-plans')
    return response.data.data
  }

  async show(id: TUUID) {
    const response = await api.get<IResource<ISubscriptionPlan>>(`/subscription-plans/${id}`)
    return response.data
  }

  async buy(request: StoreSubscriptionRequest) {
    const response = await api.post('/subscriptions', request)
    return response.data
  }

  async createCheckoutSession(request: CreateCheckoutSessionRequest) {
    const response = await api.post<IResource<ICreateCheckoutSessionResponse>>('/subscription/checkout', request)
    return response.data
  }
}

export const subscriptionService = new SubscriptionService()
