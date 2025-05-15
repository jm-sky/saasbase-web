export interface IResourceMeta {
  currentPage: number
  lastPage: number
  perPage: number
  total: number
}

export interface IResource<T> {
  data: T[]
  meta: IResourceMeta
}

export type FilterValue = string | boolean | number | Date
export type FilterOperator = 'eq' | 'like' | 'gte' | 'lte' | string
export type FilterDefinition = { value?: FilterValue; operator?: FilterOperator }
