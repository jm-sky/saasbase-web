import type { IInvoiceBody, IInvoiceBuyer, IInvoiceOptions, IInvoicePayment, IInvoiceSeller, TInvoiceStatus, TInvoiceType } from '@/domains/financial/types/financial.type'
import type { TDate, TDateTime, TUUID } from '@/domains/shared/types/common'

export interface IExpense {
  id: TUUID;
  tenantId: string;
  type: TInvoiceType;
  status: TInvoiceStatus;
  number: string;
  numberingTemplateId: string;
  totalNet: number;
  totalTax: number;
  totalGross: number;
  currency: string;
  exchangeRate: number;
  seller: IInvoiceSeller;
  buyer: IInvoiceBuyer;
  body: IInvoiceBody;
  payment: IInvoicePayment;
  options: IInvoiceOptions;
  issueDate?: TDate | null;
  createdAt?: TDateTime | null;
  updatedAt?: TDateTime | null;
}

export interface IExpenseCreate {
  type: TInvoiceType;
  status: TInvoiceStatus;
  number: string;
  numberingTemplateId?: string;
  totalNet: number;
  totalTax: number;
  totalGross: number;
  currency: string;
  exchangeRate: number;
  seller: IInvoiceSeller;
  buyer: IInvoiceBuyer;
  data: IInvoiceBody;
  payment: IInvoicePayment;
  options: IInvoiceOptions;
  issueDate?: TDate | null;
}
