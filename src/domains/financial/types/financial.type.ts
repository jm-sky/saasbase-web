import type { TUUID } from '@/domains/shared/types/common'
import type { TVatRateType } from '@/domains/shared/types/vatRate.type'

export type TInvoiceStatus =
  | 'draft'
  | 'processing'
  | 'issued'
  | 'completed'
  | 'cancelled'

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
  | 'partiallyPaid'
  | 'pending'

export type TApprovalStatus =
  | 'notRequired'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'cancelled'

export type TDeliveryStatus =
  | 'notSent'
  | 'pending'
  | 'sent'
  | 'delivered'
  | 'failed'

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
  description?: string;
}

export interface IVatRateData {
  id: string;
  name: string;
  rate: number;
  type: TVatRateType;
}

export interface IInvoiceLine {
  id: TUUID;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: IVatRateData;
  totalNet: number;
  totalVat: number;
  totalGross: number;
  productId?: string | null;
  gtuCodes?: string[];
}

export interface IInvoiceVatSummary {
  vatRate: {
    rate: number;
    category?: string;
  };
  net: number;
  vat: number;
  gross: number;
}

export interface IInvoiceExchange {
  currency: string;
  exchangeRate: number;
  date: string;
}

export interface IInvoicePaymentMethod {
  id?: TUUID;
  name?: string;
  paymentDays?: number
}

export interface IInvoicePayment {
  status: TPaymentStatus;
  dueDate?: string;
  paidDate?: string;
  paidAmount?: number;
  method: IInvoicePaymentMethod;
  reference?: string;
  terms?: string;
  notes?: string;
  bankAccount?: {
    name?: string;
    iban?: string;
    swift?: string;
    address?: string;
  };
}

export interface IInvoiceOptions {
  language: string;
  template: string;
  sendEmail: boolean;
  emailTo: string[];
}
