import { type IInvoice, Invoice } from '@/domains/invoice/models/invoice.model'
import api from '@/lib/api'
import { apiRoutesMap } from '@/lib/api/apiRoutes'
import type { TInvoiceStatus } from '@/types'

export interface IInvoiceGetParams {
  contractorId?: string
  status?: TInvoiceStatus
  startDate?: string
  endDate?: string
  limit?: number
  offset?: number
}

class InvoiceService {
  async index(params?: IInvoiceGetParams): Promise<Invoice[]> {
    const response = await api.get<{ data: IInvoice[] }>(apiRoutesMap.invoices, { params })
    return response.data.data.map(data => Invoice.load(data))
  }

  async get(id: string): Promise<Invoice> {
    const response = await api.get<{ data: IInvoice }>(`${apiRoutesMap.invoices}/${id}`)
    return Invoice.load(response.data.data)
  }

  async create(invoice: Omit<IInvoice, 'id' | 'createdAt' | 'updatedAt'>): Promise<Invoice> {
    const response = await api.post<{ data: IInvoice }>(apiRoutesMap.invoices, invoice)
    return Invoice.load(response.data.data)
  }

  async update(id: string, invoice: Partial<IInvoice>): Promise<Invoice> {
    const response = await api.patch<{ data: IInvoice }>(`${apiRoutesMap.invoices}/${id}`, invoice)
    return Invoice.load(response.data.data)
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${apiRoutesMap.invoices}/${id}`)
  }
}

export const invoiceService = new InvoiceService()
