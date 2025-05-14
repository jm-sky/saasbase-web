import { type IProduct } from '@/domains/product/models/product.model'
import api from '@/lib/api'
import { apiRoutesMap } from '@/lib/api/apiRoutes'
import type { IResource } from '@/domains/shared/types/resource.type'

export interface IProductFilters {
  search?: string
  page?: number
  perPage?: number
}

class ProductService {
  async index(params?: IProductFilters): Promise<IResource<IProduct>> {
    const response = (await api.get<IResource<IProduct>>(apiRoutesMap.products, { params })).data
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
