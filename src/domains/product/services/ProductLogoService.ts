import api from '@/lib/api'

class ProductLogoService {
  async upload(productId: string, file: File): Promise<void> {
    const formData = new FormData()
    formData.append('image', file)

    await api.post(`/products/${productId}/logo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }

  async show(productId: string): Promise<void> {
    await api.get(`/products/${productId}/logo`)
  }

  async delete(productId: string): Promise<void> {
    await api.delete(`/products/${productId}/logo`)
  }
}

export const productLogoService = new ProductLogoService()
