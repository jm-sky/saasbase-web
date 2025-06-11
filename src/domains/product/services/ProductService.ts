import { type IProduct, type IProductCreate, type IProductUpdate } from '@/domains/product/types/product.type'
import { buildSpatieQuery } from '@/domains/shared/helpers/filtering'
import { type FilterDefinition, type IResource, type IResourceCollection } from '@/domains/shared/types/resource.type'
import api from '@/lib/api'
import { apiRoutesMap } from '@/lib/api/apiRoutes'
import type { SortingState } from '@tanstack/vue-table'

export interface IProductFilters {
  search?: string
  page?: number
  perPage?: number
  filter?: Record<string, FilterDefinition>
  sort?: SortingState
}

class ProductService {
  async index(filters?: IProductFilters): Promise<IResourceCollection<IProduct>> {
    const params = buildSpatieQuery(filters ?? { filter: {} })
    const response = (await api.get<IResourceCollection<IProduct>>(apiRoutesMap.products, { params })).data
    return response
  }

  async get(id: string): Promise<IProduct> {
    const response = (await api.get<IResource<IProduct>>(`${apiRoutesMap.products}/${id}`)).data
    return response.data
  }

  async create(product: IProductCreate): Promise<IProduct> {
    const response = (await api.post<IResource<IProduct>>(apiRoutesMap.products, product)).data
    return response.data
  }

  async update(id: string, product: Partial<IProductUpdate>): Promise<IProduct> {
    const response = (await api.patch<IResource<IProduct>>(`${apiRoutesMap.products}/${id}`, product)).data
    return response.data
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${apiRoutesMap.products}/${id}`)
  }

  async export(filters?: IProductFilters): Promise<Blob> {
    const params = buildSpatieQuery(filters ?? { filter: {} })
    const response = await api.get(`${apiRoutesMap.products}/export`, { params, responseType: 'blob' })
    return response.data
  }
}

export const productService = new ProductService()
