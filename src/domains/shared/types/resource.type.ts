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
