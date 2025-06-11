
import { buildSpatieQuery } from '@/domains/shared/helpers/filtering'
import api from '@/lib/api'
import { apiRoutesMap } from '@/lib/api/apiRoutes'
import type { SortingState } from '@tanstack/vue-table'
import type { IInvoice, IInvoiceCreate } from '@/domains/invoice/types/invoice.type'
import type { FilterDefinition, IResource, IResourceCollection } from '@/domains/shared/types/resource.type'

export interface IInvoiceFilters {
  search?: string
  page?: number
  perPage?: number
  filter?: Record<string, FilterDefinition>
  sort?: SortingState
}

class InvoiceService {
  async index(filters?: IInvoiceFilters): Promise<IResourceCollection<IInvoice>> {
    const params = buildSpatieQuery(filters ?? { filter: {} })
    const response = await api.get<IResourceCollection<IInvoice>>(apiRoutesMap.invoices, { params })
    return response.data
  }

  async get(id: string): Promise<IInvoice> {
    const response = await api.get<IResource<IInvoice>>(`${apiRoutesMap.invoices}/${id}`)
    return response.data.data
  }

  async create(invoice: IInvoiceCreate): Promise<IInvoice> {
    const response = await api.post<IResource<IInvoice>>(apiRoutesMap.invoices, invoice)
    return response.data.data
  }

  async update(id: string, invoice: Partial<IInvoice>): Promise<IInvoice> {
    const response = await api.patch<IResource<IInvoice>>(`${apiRoutesMap.invoices}/${id}`, invoice)
    return response.data.data
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${apiRoutesMap.invoices}/${id}`)
  }

  async export(filters?: IInvoiceFilters): Promise<Blob> {
    const params = buildSpatieQuery(filters ?? { filter: {} })
    const response = await api.get(`${apiRoutesMap.invoices}/export`, { params, responseType: 'blob' })
    return response.data
  }
}

export const invoiceService = new InvoiceService()
