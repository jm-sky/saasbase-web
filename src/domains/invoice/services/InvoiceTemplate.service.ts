import api from '@/lib/api'
import type { IInvoiceTemplate } from '../types/invoiceTemplate.type'
import type { IResource, IResourceCollection } from '@/domains/shared/types/resource.type'

class InvoiceTemplateService {
  async index(): Promise<IResourceCollection<IInvoiceTemplate>> {
    return (await api.get<IResourceCollection<IInvoiceTemplate>>('/invoice-templates')).data
  }

  async create(data: IInvoiceTemplate): Promise<IInvoiceTemplate> {
    return (await api.post<IResource<IInvoiceTemplate>>('/invoice-templates', data)).data.data
  }

  async update(id: string, data: IInvoiceTemplate): Promise<IInvoiceTemplate> {
    return (await api.put<IResource<IInvoiceTemplate>>(`/invoice-templates/${id}`, data)).data.data
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/invoice-templates/${id}`)
  }
}

export const invoiceTemplateService = new InvoiceTemplateService()
