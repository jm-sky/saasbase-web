import type { TApprovalStatus, TDeliveryStatus, TInvoiceAllocationStatus, TInvoiceOcrStatus, TInvoiceStatus, TInvoiceType, TPaymentStatus } from '../types/financial.type'

export const invoiceTypes: TInvoiceType[] = [
  'basic',
  'advance-payment',
  'export',
  'import',
  'settlement',
  'ue',
  'debit-note',
  'proforma',
  'settlement-correction',
  'ue-correction',
]

export const invoiceStatuses: TInvoiceStatus[] = [
  'draft',
  'processing',
  'issued',
  'completed',
  'cancelled',
]

export const invoiceOcrStatuses: TInvoiceOcrStatus[] = [
  'pending',
  'processing',
  'completed',
  'failed',
]

export const paymentStatuses: TPaymentStatus[] = [
  'pending',
  'paid',
  'partiallyPaid',
  'overdue',
  'cancelled',
]

export const approvalStatuses: TApprovalStatus[] = [
  'notRequired',
  'pending',
  'approved',
  'rejected',
  'cancelled',
]

export const invoiceAllocationStatuses: TInvoiceAllocationStatus[] = [
  'notRequired',
  'pending',
  'partiallyAllocated',
  'fullyAllocated',
]

export const deliveryStatuses: TDeliveryStatus[] = [
  'notSent',
  'pending',
  'sent',
  'delivered',
  'failed',
]
