
import api from '@/lib/api'
import { apiRoutesMap } from '@/lib/api/apiRoutes'
import type { IInvoice, IInvoiceCreate, TInvoiceStatus } from '@/domains/invoice/types/invoice.type'
import type { IResource, IResourceCollection } from '@/domains/shared/types/resource.type'

export interface IInvoiceGetParams {
  contractorId?: string
  status?: TInvoiceStatus
  startDate?: string
  endDate?: string
  limit?: number
  offset?: number
}

class InvoiceService {
  async index(params?: IInvoiceGetParams): Promise<IResourceCollection<IInvoice>> {
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
}

export const invoiceService = new InvoiceService()
