import type { IInvoiceFilters } from '../services/invoiceService'

export const invoiceKeys = {
  all: ['invoices'] as const,
  lists: () => [...invoiceKeys.all, 'list'] as const,
  list: (filters?: IInvoiceFilters) => [...invoiceKeys.lists(), filters] as const,
  details: () => [...invoiceKeys.all, 'detail'] as const,
  detail: (id: string) => [...invoiceKeys.details(), id] as const,
}
