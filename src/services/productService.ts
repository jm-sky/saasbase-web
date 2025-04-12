import api from '@/helpers/api'
import { apiRoutesMap } from '@/helpers/api/apiRoutes'
import { type IProduct } from '@/models/product.model'

export interface IProductGetParams {
  limit?: number
  offset?: number
}

class ProductService {
  async index(params?: IProductGetParams): Promise<IProduct[]> {
    const response = await api.get<{ products: IProduct[] }>(apiRoutesMap.products, { params })
    return response.data.products
  }

  async get(id: string): Promise<IProduct> {
    const response = await api.get<IProduct>(`${apiRoutesMap.products}/${id}`)
    return response.data
  }

  async create(product: Omit<IProduct, 'id' | 'createdAt' | 'updatedAt'>): Promise<IProduct> {
    const response = await api.post<IProduct>(apiRoutesMap.products, product)
    return response.data
  }

  async update(id: string, product: Partial<IProduct>): Promise<IProduct> {
    const response = await api.patch<IProduct>(`${apiRoutesMap.products}/${id}`, product)
    return response.data
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${apiRoutesMap.products}/${id}`)
  }
}

export const productService = new ProductService()
