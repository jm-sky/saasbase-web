import api from '@/lib/api'
import type { IInvoice } from '../types/invoice.type'
import type { IResource, IResourceCollection } from '@/domains/shared/types/resource.type'

export interface IInvoiceShareToken {
  id: string
  token: string
  shareableType: string
  shareableId: string
  onlyForAuthenticated: boolean
  expiresAt: string | null
  lastUsedAt: string | null
  usageCount: number
  maxUsage: number | null
  createdAt: string
  updatedAt: string
}

export interface ICreateInvoiceShareTokenPayload {
  expiresAt: string
  onlyForAuthenticated: boolean
  maxUsage: number
}

export interface IPublicSharedInvoice {
  id: string
  number: string
  type: string
  status: string
  issueDate: string | null
  currency: string
  totalNet: number
  totalTax: number
  totalGross: number
  seller: Record<string, unknown> | null
  buyer: Record<string, unknown> | null
}

class InvoiceShareTokenService {
  async index(invoiceId: string): Promise<IInvoiceShareToken[]> {
    const response = await api.get<IResourceCollection<IInvoiceShareToken>>(`/invoices/${invoiceId}/share-tokens`)
    return response.data.data
  }

  async create(invoiceId: string, payload: ICreateInvoiceShareTokenPayload): Promise<IInvoiceShareToken> {
    const response = await api.post<IResource<IInvoiceShareToken>>(`/invoices/${invoiceId}/share-tokens`, payload)
    return response.data.data
  }

  async destroy(invoiceId: string, tokenId: string): Promise<void> {
    await api.delete(`/invoices/${invoiceId}/share-tokens/${tokenId}`)
  }

  async getPublicInvoice(token: string): Promise<IPublicSharedInvoice> {
    const response = await api.get<IResource<IPublicSharedInvoice>>(`/shared/invoices/${token}`)
    return response.data.data
  }
}

export const invoiceShareTokenService = new InvoiceShareTokenService()

export type { IInvoice }
