import type { TUUID } from '@/domains/shared/types/common'

export type TInvoiceStatus = 'draft' | 'ocrProcessing' | 'sent' | 'paid' | 'partiallyPaid' | 'overdue' | 'cancelled'

// Enums
export type TInvoiceType  =
  | 'advance-payment'
  | 'advance-payment-correction'
  | 'basic'
  | 'basic-correction'
  | 'debit-note'
  | 'debit-note-correction'
  | 'export'
  | 'export-correction'
  | 'import'
  | 'import-correction'
  | 'proforma'
  | 'settlement'
  | 'settlement-correction'
  | 'ue'
  | 'ue-correction'

export type TPaymentStatus =
  | 'cancelled'
  | 'overdue'
  | 'paid'
  | 'pending'


export type TPaymentMethod =
  | 'bankTransfer'
  | 'cash'
  | 'creditCard'
  | 'other'
  | 'paypal'

export type TVatRate =
  | '0%'
  | '5%'
  | '8%'
  | '23%'
  | 'zw'
  | 'np'

// Nested interfaces
export interface IInvoiceSeller {
  contractorId?: TUUID;
  contractorType?: string;
  name: string;
  taxId?: string;
  address?: string;
  country: string;
  iban?: string;
  email?: string;
  phone?: string;
}

export interface IInvoiceBuyer {
  contractorId?: TUUID;
  contractorType?: string;
  name: string;
  taxId?: string;
  address?: string;
  country: string;
  iban?: string | null;
  email?: string;
  phone?: string;
}

export interface IInvoiceBody {
  lines: IInvoiceLine[];
  vatSummary: IInvoiceVatSummary[];
  exchange: IInvoiceExchange;
}

export interface IInvoiceLine {
  id: TUUID;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: TVatRate;
  totalNet: number;
  totalVat: number;
  totalGross: number;
  productId: string | null;
}

export interface IInvoiceVatSummary {
  vatRate: TVatRate;
  net: number;
  vat: number;
  gross: number;
}

export interface IInvoiceExchange {
  currency: string;
  exchangeRate: number;
  date: string;
}

export interface IInvoicePayment {
  status: TPaymentStatus;
  dueDate: string;
  paidDate: string | null;
  paidAmount: number;
  method: TPaymentMethod;
  reference: string;
  terms: string;
  notes: string | null;
}

export interface IInvoiceOptions {
  language: string;
  template: string;
  sendEmail: boolean;
  emailTo: string[];
}
