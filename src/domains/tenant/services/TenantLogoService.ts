import api from '@/lib/api'

class TenantLogoService {
  async upload(tenantId: string, file: File): Promise<void> {
    const formData = new FormData()
    formData.append('image', file)

    await api.post(`/tenants/${tenantId}/logo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }

  async show(tenantId: string): Promise<void> {
    await api.get(`/tenants/${tenantId}/logo`)
  }

  async delete(tenantId: string): Promise<void> {
    await api.delete(`/tenants/${tenantId}/logo`)
  }
}

export const tenantLogoService = new TenantLogoService()
