import api from '@/lib/api'
import type { IResourceCollection } from '../types/resource.type'
import type { IVatRate } from '../types/vatRate.type'

export class VatRateService {
  async index(): Promise<IVatRate[]> {
    const response = await api.get<IResourceCollection<IVatRate>>('/vat-rates')
    return response.data.data
  }
}

export const vatRateService = new VatRateService()