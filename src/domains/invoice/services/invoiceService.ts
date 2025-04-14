import { apiRoutesMap } from '@/composables/api/apiRoutes'
import api from '@/helpers/api'
import { type IInvoice, Invoice } from '@/models/invoice.model'
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
    const response = await api.get<{ invoices: IInvoice[] }>(apiRoutesMap.invoices, { params })
    return response.data.invoices.map(data => Invoice.load(data))
  }

  async get(id: string): Promise<Invoice> {
    const response = await api.get<IInvoice>(`${apiRoutesMap.invoices}/${id}`)
    return Invoice.load(response.data)
  }

  async create(invoice: Omit<IInvoice, 'id' | 'createdAt' | 'updatedAt'>): Promise<Invoice> {
    const response = await api.post<IInvoice>(apiRoutesMap.invoices, invoice)
    return Invoice.load(response.data)
  }

  async update(id: string, invoice: Partial<IInvoice>): Promise<Invoice> {
    const response = await api.patch<IInvoice>(`${apiRoutesMap.invoices}/${id}`, invoice)
    return Invoice.load(response.data)
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${apiRoutesMap.invoices}/${id}`)
  }
}

export const invoiceService = new InvoiceService()
