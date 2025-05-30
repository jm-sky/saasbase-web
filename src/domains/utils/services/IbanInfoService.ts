import api from '@/lib/api'
import type { IResource } from '@/domains/shared/types/resource.type'

export interface IIbanInfo {
  iban: string
  bankName: string
  branchName: string
  swift?: string
}

class IbanInfoService {
  async getIbanInfo(iban: string, country?: string) {
    const response = (await api.get<IResource<IIbanInfo>>('/utils/iban-info', { params: { iban, country } })).data
    return response.data
  }
}

export const ibanInfoService = new IbanInfoService()