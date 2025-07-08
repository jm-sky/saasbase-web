import type { FilterDefinition } from './resource.type'
import type { SortingState } from '@tanstack/vue-table'

export interface IExchangeRate {
  id: string
  date: string
  rate: number
  table: string
  source: string
  createdAt: string
}

export interface IExchangeRateFilters {
  search?: string
  page?: number
  perPage?: number
  filter?: {
    date?: FilterDefinition
    currency?: FilterDefinition
    table?: FilterDefinition
    source?: FilterDefinition
  }
  sort?: SortingState
}