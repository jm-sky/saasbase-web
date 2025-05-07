import { type IProduct, Product } from '@/domains/product/models/product.model'
import api from '@/lib/api'
import { apiRoutesMap } from '@/lib/api/apiRoutes'

export interface IProductGetParams {
  limit?: number
  offset?: number
}

class ProductService {
  async index(params?: IProductGetParams): Promise<Product[]> {
    const response = await api.get<{ data: IProduct[] }>(apiRoutesMap.products, { params })
    return response.data.data.map(data => Product.load(data))
  }

  async get(id: string): Promise<Product> {
    const response = await api.get<{ data: IProduct }>(`${apiRoutesMap.products}/${id}`)
    return Product.load(response.data.data)
  }

  async create(product: Omit<IProduct, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const response = await api.post<{ data: IProduct }>(apiRoutesMap.products, product)
    return Product.load(response.data.data)
  }

  async update(id: string, product: Partial<IProduct>): Promise<Product> {
    const response = await api.patch<{ data: IProduct }>(`${apiRoutesMap.products}/${id}`, product)
    return Product.load(response.data.data)
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${apiRoutesMap.products}/${id}`)
  }
}

export const productService = new ProductService()
