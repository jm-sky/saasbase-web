import api from '@/lib/api'
import type { ICompanyLookupResponse } from '../types/companyLookup.type'
import type { IResource } from '@/domains/shared/types/resource.type'

class CompanyLookupService {
  async lookup(country: string, vatId: string): Promise<ICompanyLookupResponse> {
    const response = await api.get<IResource<ICompanyLookupResponse>>('/utils/company-lookup', {
      params: {
        country,
        vatId,
      },
    })
    return response.data.data
  }
}

export const companyLookupService = new CompanyLookupService()
