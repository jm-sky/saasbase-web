import api from '@/lib/api'
import type { IInvoiceNumberingTemplate } from '../types/numberingTemplate.type'
import type { IResource, IResourceCollection } from '@/domains/shared/types/resource.type'

class NumberingTemplateService {
  async index(): Promise<IResourceCollection<IInvoiceNumberingTemplate>> {
    return (await api.get<IResourceCollection<IInvoiceNumberingTemplate>>('/numbering-templates')).data
  }

  async create(data: IInvoiceNumberingTemplate): Promise<IInvoiceNumberingTemplate> {
    return (await api.post<IResource<IInvoiceNumberingTemplate>>('/numbering-templates', data)).data.data
  }

  async update(id: string, data: IInvoiceNumberingTemplate): Promise<IInvoiceNumberingTemplate> {
    return (await api.put<IResource<IInvoiceNumberingTemplate>>(`/numbering-templates/${id}`, data)).data.data
  }

  async setDefault(id: string): Promise<void> {
    await api.post(`/numbering-templates/${id}/set-default`)
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/numbering-templates/${id}`)
  }
}

export const numberingTemplateService = new NumberingTemplateService()
