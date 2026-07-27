import type { TInvoiceType } from '@/domains/financial/types/financial.type'
import type { TDateTime, TUUID } from '@/domains/shared/types/common'

export type TResetPeriod = 'monthly' | 'yearly' | 'never'

export interface IInvoiceNumberingTemplate {
  id: TUUID;
  tenantId?: TUUID;
  name: string;
  invoiceType: TInvoiceType;
  format: string;
  nextNumber: number;
  resetPeriod: TResetPeriod;
  prefix: string;
  suffix: string;
  isDefault: boolean;
  createdAt: TDateTime;
  updatedAt: TDateTime;
}

export interface IInvoiceNumberingTemplateForm {
  name: string;
  invoiceType: TInvoiceType;
  format: string;
  nextNumber: number;
  resetPeriod: TResetPeriod;
  prefix: string;
  suffix: string;
}

export interface IInvoiceTypeGroup {
  key: string;
  label: string;
  baseType: TInvoiceType;
  correctionType?: TInvoiceType;
  templates: {
    base: IInvoiceNumberingTemplate[];
    correction: IInvoiceNumberingTemplate[];
  };
}

export interface IFormatElement {
  id: string;
  type: 'year4' | 'year2' | 'month' | 'number3' | 'number4' | 'text';
  value: string;
  placeholder: string;
}