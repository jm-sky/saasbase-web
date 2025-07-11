import api from '@/lib/api'
import type { IInvoiceTemplate, IInvoiceTemplatePreview } from '../types/invoiceTemplate.type'
import type { IResource, IResourceCollection } from '@/domains/shared/types/resource.type'

export interface ITemplatePreviewOptions {
  language: string
  currency: string
  accentColor: string
  secondaryColor: string
  includeLogo: boolean
  includeSignatures: boolean
  dateFormat: string
  timezone: string
}

export interface ITemplatePreviewRequest {
  content: string
  options: ITemplatePreviewOptions
  previewData: Record<string, unknown>
}

export interface ITemplatePreviewResponse {
  html: string
}

class InvoiceTemplateService {
  async index(): Promise<IResourceCollection<IInvoiceTemplatePreview>> {
    return (await api.get<IResourceCollection<IInvoiceTemplatePreview>>('/invoice-templates')).data
  }

  async get(id: string): Promise<IInvoiceTemplate> {
    return (await api.get<IResource<IInvoiceTemplate>>(`/invoice-templates/${id}`)).data.data
  }

  async create(data: Partial<IInvoiceTemplate>): Promise<IInvoiceTemplate> {
    return (await api.post<IResource<IInvoiceTemplate>>('/invoice-templates', data)).data.data
  }

  async update(id: string, data: Partial<IInvoiceTemplate>): Promise<IInvoiceTemplate> {
    return (await api.put<IResource<IInvoiceTemplate>>(`/invoice-templates/${id}`, data)).data.data
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/invoice-templates/${id}`)
  }

  async setDefault(id: string): Promise<void> {
    await api.post(`/invoice-templates/${id}/set-default`)
  }

  async activate(id: string): Promise<void> {
    await api.post(`/invoice-templates/${id}/activate`)
  }

  async deactivate(id: string): Promise<void> {
    await api.post(`/invoice-templates/${id}/deactivate`)
  }

  async preview(request: ITemplatePreviewRequest): Promise<ITemplatePreviewResponse> {
    return (await api.post<ITemplatePreviewResponse>('/invoice-templates/preview', request)).data
  }
}

export const invoiceTemplateService = new InvoiceTemplateService()
