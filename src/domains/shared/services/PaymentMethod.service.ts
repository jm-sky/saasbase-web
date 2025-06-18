import api from '@/lib/api'
import type { TUUID } from '../types/common'
import type { IPaymentMethod } from '../types/paymentMethod.type'
import type { IResourceCollection } from '../types/resource.type'

class PaymentMethodService {
  async index(): Promise<IPaymentMethod[]> {
    const response = await api.get<IResourceCollection<IPaymentMethod>>('/payment-methods')
    return response.data.data
  }

  async create(data: IPaymentMethod): Promise<IPaymentMethod> {
    const response = await api.post<IPaymentMethod>('/payment-methods', data)
    return response.data
  }

  async update(id: TUUID, data: IPaymentMethod): Promise<IPaymentMethod> {
    const response = await api.put<IPaymentMethod>(`/payment-methods/${id}`, data)
    return response.data
  }

  async delete(id: TUUID): Promise<void> {
    await api.delete(`/payment-methods/${id}`)
  }
}

export const paymentMethodService = new PaymentMethodService()