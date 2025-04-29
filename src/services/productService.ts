import { type IProduct, Product } from '@/domains/product/models/product.model'
import api from '@/helpers/api'
import { apiRoutesMap } from '@/helpers/api/apiRoutes'

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
    const response = await api.get<IProduct>(`${apiRoutesMap.products}/${id}`)
    return Product.load(response.data)
  }

  async create(product: Omit<IProduct, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const response = await api.post<IProduct>(apiRoutesMap.products, product)
    return Product.load(response.data)
  }

  async update(id: string, product: Partial<IProduct>): Promise<Product> {
    const response = await api.patch<IProduct>(`${apiRoutesMap.products}/${id}`, product)
    return Product.load(response.data)
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${apiRoutesMap.products}/${id}`)
  }
}

export const productService = new ProductService()
