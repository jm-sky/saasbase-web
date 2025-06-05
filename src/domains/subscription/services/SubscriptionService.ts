import { buildSpatieQuery } from '@/domains/shared/helpers/filtering'
import api from '@/lib/api'
import type { CreateCheckoutSessionRequest, ISubscriptionPlan, StoreSubscriptionRequest } from '../types/subscription.type'
import type { SortingState } from '@tanstack/vue-table'
import type { TUUID } from '@/domains/shared/types/common'
import type { FilterDefinition, IResource, IResourceCollection } from '@/domains/shared/types/resource.type'

export interface ISubscriptionPlanFilters {
  search?: string
  page?: number
  perPage?: number
  filter?: Record<'isActive', FilterDefinition>
  sort?: SortingState
}

export interface ICreateCheckoutSessionResponse {
  checkoutUrl: string
  sessionId: string
}

class SubscriptionService {
  async index(filters?: ISubscriptionPlanFilters) {
    const params = buildSpatieQuery(filters ?? { filter: {} })
    const response = await api.get<IResourceCollection<ISubscriptionPlan>>('/subscription-plans', { params })
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
