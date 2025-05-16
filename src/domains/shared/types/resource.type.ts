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

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export type FilterOperator = 'eq' | 'like' | 'gte' | 'lte' | string

export interface FilterDefinition { value?: FilterValue; operator?: FilterOperator }
