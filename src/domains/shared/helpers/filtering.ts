import type { FilterDefinition, FilterValue } from '../types/resource.type'

export interface IGenericFilters {
  search?: string
  page?: number
  perPage?: number
  filter?: Record<string, FilterDefinition>
}

// Helper: serializuje różne typy do stringów akceptowanych w query
export function serializeValue(val: FilterValue | null | undefined): string {
  if (val === null || val === undefined) return ''
  if (typeof val === 'boolean') return val ? 'true' : 'false'
  if (val instanceof Date) return val.toISOString()
  return String(val)
}

export function buildSpatieQuery(filters: IGenericFilters): Record<string, unknown> {
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
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
