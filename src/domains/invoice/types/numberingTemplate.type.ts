import type { TInvoiceType } from '@/domains/financial/types/financial.type'
import type { TDateTime, TUUID } from '@/domains/shared/types/common'

export interface IInvoiceNumberingTemplate {
  id: TUUID;
  tenantId?: TUUID;
  name: string;
  invoiceType: TInvoiceType;
  format: string;
  nextNumber: number;
  resetPeriod: string;
  prefix: string;
  suffix: string;
  isDefault: boolean;
  createdAt: TDateTime;
  updatedAt: TDateTime;
}