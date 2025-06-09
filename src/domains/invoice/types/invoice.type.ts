import type { TDate, TDateTime } from '@/domains/shared/types/common'

export type TInvoiceStatus = 'draft' | 'sent' | 'paid' | 'partiallyPaid' | 'overdue' | 'cancelled'

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

export type TInvoicePaymentStatus =
  | 'cancelled'
  | 'overdue'
  | 'paid'
  | 'pending'


export type TInvoicePaymentMethod =
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

// Main Invoice interface
export interface IInvoice {
  id: string;
  tenantId: string;
  type: TInvoiceType;
  status: string;
  number: string;
  numberingTemplateId: string;
  totalNet: number;
  totalTax: number;
  totalGross: number;
  currency: string;
  exchangeRate: number;
  seller: IInvoiceSeller;
  buyer: IInvoiceBuyer;
  data: IInvoiceData;
  payment: IInvoicePayment;
  options: IInvoiceOptions;
  issueDate?: TDate | null;
  createdAt?: TDateTime | null;
  updatedAt?: TDateTime | null;
  numberingTemplate?: INumberingTemplate;
}

// Nested interfaces
export interface IInvoiceSeller {
  contractorId: number;
  contractorType: string;
  name: string;
  taxId: string;
  address: string;
  country: string;
  iban: string;
  email: string | null;
}

export interface IInvoiceBuyer {
  contractorId: number;
  contractorType: string;
  name: string;
  taxId: string;
  address: string;
  country: string;
  iban: string | null;
  email: string;
}

export interface IInvoiceData {
  lines: IInvoiceLine[];
  vatSummary: IInvoiceVatSummary[];
  exchange: IInvoiceExchange;
}

export interface IInvoiceLine {
  id: string;
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
  status: TInvoicePaymentStatus;
  dueDate: string;
  paidDate: string | null;
  paidAmount: number;
  method: TInvoicePaymentMethod;
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

export interface INumberingTemplate {
  id: string;
  tenantId: string;
  name: string;
  invoiceType: string;
  format: string;
  nextNumber: number;
  resetPeriod: string;
  prefix: string;
  suffix: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}
