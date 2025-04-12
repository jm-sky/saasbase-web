import api from '@/helpers/api'
import { apiRoutesMap } from '@/helpers/api/apiRoutes'
import { type IInvoice, type TInvoiceStatus } from '@/models/invoice.model'

export interface IInvoiceGetParams {
  contractorId?: string
  status?: TInvoiceStatus
  startDate?: string
  endDate?: string
  limit?: number
  offset?: number
}

class InvoiceService {
  async index(params?: IInvoiceGetParams): Promise<IInvoice[]> {
    const response = await api.get<{ invoices: IInvoice[] }>(apiRoutesMap.invoices, { params })
    return response.data.invoices
  }

  async get(id: string): Promise<IInvoice> {
    const response = await api.get<IInvoice>(`${apiRoutesMap.invoices}/${id}`)
    return response.data
  }

  async create(invoice: Omit<IInvoice, 'id' | 'createdAt' | 'updatedAt'>): Promise<IInvoice> {
    const response = await api.post<IInvoice>(apiRoutesMap.invoices, invoice)
    return response.data
  }

  async update(id: string, invoice: Partial<IInvoice>): Promise<IInvoice> {
    const response = await api.patch<IInvoice>(`${apiRoutesMap.invoices}/${id}`, invoice)
    return response.data
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${apiRoutesMap.invoices}/${id}`)
  }
}

export const invoiceService = new InvoiceService()
