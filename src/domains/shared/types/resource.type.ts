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

export type TFilterOperator = 'eq'
  | 'ne'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'like'
  | 'nlike'
  | 'startswith'
  | 'endswith'
  | 'regex'
  | 'null'
  | 'notnull'
  | 'nullish'
  | 'in'
  | 'nin'
  | 'between'

export type FilterValue = string | boolean | number | Date
export type FilterOperator = 'eq' | 'like' | 'gte' | 'lte' | string
export type FilterDefinition = { value?: FilterValue; operator?: FilterOperator }
