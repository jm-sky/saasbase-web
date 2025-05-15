import { type IContractor } from '@/domains/contractor/models/contractor.model'
import api from '@/lib/api'
import { apiRoutesMap } from '@/lib/api/apiRoutes'
import type { FilterDefinition, IResource } from '@/domains/shared/types/resource.type'

export interface IContractorFilters {
  search?: string
  page?: number
  perPage?: number
  filter?: Record<string, FilterDefinition>
}

// Helper: serializuje różne typy do stringów akceptowanych w query
export function serializeValue(val: unknown): string {
  if (val === null || val === undefined) return ''
  if (typeof val === 'boolean') return val ? 'true' : 'false'
  if (val instanceof Date) return val.toISOString()
  return String(val)
}

export function buildSpatieQuery(filters: IContractorFilters): Record<string, unknown> {
  const query: {
    page?: number
    perPage?: number
    filter: Record<string, string>
  } = {
    page: filters.page,
    perPage: filters.perPage,
    filter: {},
  }

  if (filters.search) {
    query.filter.search = serializeValue(filters.search)
  }

  for (const [key, { value, operator }] of Object.entries(filters.filter ?? {})) {
    if (value === null || value === undefined || value === '') continue

    const serialized = serializeValue(value)

    if (operator && operator !== 'eq') {
      query.filter[`${key}:${operator}`] = serialized
    } else {
      query.filter[key] = serialized
    }
  }

  return query
}

class ContractorService {
  async index(filters?: IContractorFilters): Promise<IResource<IContractor>> {
    const params = buildSpatieQuery(filters ?? { filter: {} })
    const response = (await api.get<IResource<IContractor>>(apiRoutesMap.contractors, { params })).data
    return response
  }

  async get(id: string): Promise<IContractor> {
    const response = (await api.get<{ data: IContractor }>(`${apiRoutesMap.contractors}/${id}`)).data
    return response.data
  }

  async create(contractor: Omit<IContractor, 'id' | 'createdAt' | 'updatedAt'>): Promise<IContractor> {
    const response = (await api.post<{ data: IContractor }>(apiRoutesMap.contractors, contractor)).data
    return response.data
  }

  async update(id: string, contractor: Partial<IContractor>): Promise<IContractor> {
    const response = (await api.patch<{ data: IContractor }>(`${apiRoutesMap.contractors}/${id}`, contractor)).data
    return response.data
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${apiRoutesMap.contractors}/${id}`)
  }
}

export const contractorService = new ContractorService()
