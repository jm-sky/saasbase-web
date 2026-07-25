import type { TInvoiceStatus } from '@/domains/financial/types/financial.type'

/** Mirrors backend InvoiceStatus::isCompleted() — completed and cancelled are final. */
export const isInvoiceFinanciallyLocked = (status?: TInvoiceStatus | null): boolean =>
  status === 'completed' || status === 'cancelled'
