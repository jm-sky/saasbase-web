import api from '@/lib/api'
import type { IInvoiceNumberingTemplate, IInvoiceNumberingTemplateForm } from '../types/numberingTemplate.type'
import type { IResource, IResourceCollection } from '@/domains/shared/types/resource.type'

class NumberingTemplateService {
  async index(): Promise<IResourceCollection<IInvoiceNumberingTemplate>> {
    return (await api.get<IResourceCollection<IInvoiceNumberingTemplate>>('/numbering-templates')).data
  }

  async show(id: string): Promise<IInvoiceNumberingTemplate> {
    return (await api.get<IResource<IInvoiceNumberingTemplate>>(`/numbering-templates/${id}`)).data.data
  }

  async create(data: IInvoiceNumberingTemplateForm): Promise<IInvoiceNumberingTemplate> {
    return (await api.post<IResource<IInvoiceNumberingTemplate>>('/numbering-templates', data)).data.data
  }

  async update(id: string, data: Partial<IInvoiceNumberingTemplateForm>): Promise<IInvoiceNumberingTemplate> {
    return (await api.put<IResource<IInvoiceNumberingTemplate>>(`/numbering-templates/${id}`, data)).data.data
  }

  async setDefault(id: string): Promise<void> {
    await api.post(`/numbering-templates/${id}/set-default`)
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/numbering-templates/${id}`)
  }

  async previewNumber(templateData: Partial<IInvoiceNumberingTemplateForm>): Promise<string> {
    const response = await api.post<{ preview: string }>('/numbering-templates/preview', templateData)
    return response.data.preview
  }

  async validateFormat(format: string): Promise<{ isValid: boolean; errors: string[] }> {
    const response = await api.post<{ isValid: boolean; errors: string[] }>('/numbering-templates/validate-format', { format })
    return response.data
  }
}

export const numberingTemplateService = new NumberingTemplateService()
