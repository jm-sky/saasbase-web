import api from '@/lib/api'

class ContractorLogoService {
  async upload(contractorId: string, file: File): Promise<void> {
    const formData = new FormData()
    formData.append('image', file)

    await api.post(`/contractors/${contractorId}/logo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }

  async show(contractorId: string): Promise<void> {
    await api.get(`/contractors/${contractorId}/logo`)
  }

  async delete(contractorId: string): Promise<void> {
    await api.delete(`/contractors/${contractorId}/logo`)
  }
}

export const contractorLogoService = new ContractorLogoService()
