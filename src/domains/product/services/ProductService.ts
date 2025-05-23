import { type IProduct } from '@/domains/product/models/product.model'
import { buildSpatieQuery } from '@/domains/shared/helpers/filtering'
import api from '@/lib/api'
import { apiRoutesMap } from '@/lib/api/apiRoutes'
import type { FilterDefinition, IResourceCollection } from '@/domains/shared/types/resource.type'

export interface IProductFilters {
  search?: string
  page?: number
  perPage?: number
  filter?: Record<string, FilterDefinition>
}

class ProductService {
  async index(filters?: IProductFilters): Promise<IResourceCollection<IProduct>> {
    const params = buildSpatieQuery(filters ?? { filter: {} })
    const response = (await api.get<IResourceCollection<IProduct>>(apiRoutesMap.products, { params })).data
    return response
  }

  async get(id: string): Promise<IProduct> {
    const response = (await api.get<{ data: IProduct }>(`${apiRoutesMap.products}/${id}`)).data
    return response.data
  }

  async create(product: Omit<IProduct, 'id' | 'createdAt' | 'updatedAt'>): Promise<IProduct> {
    const response = (await api.post<{ data: IProduct }>(apiRoutesMap.products, product)).data
    return response.data
  }

  async update(id: string, product: Partial<IProduct>): Promise<IProduct> {
    const response = (await api.patch<{ data: IProduct }>(`${apiRoutesMap.products}/${id}`, product)).data
    return response.data
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${apiRoutesMap.products}/${id}`)
  }
}

export const productService = new ProductService()
