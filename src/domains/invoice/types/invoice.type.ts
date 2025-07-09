import type { IInvoiceNumberingTemplate } from './numberingTemplate.type'
import type { IInvoiceBody, IInvoiceBuyer, IInvoiceOptions, IInvoicePayment, IInvoiceSeller, TApprovalStatus, TDeliveryStatus, TInvoiceStatus, TInvoiceType, TPaymentStatus } from '@/domains/financial/types/financial.type'
import type { TDate, TDateTime, TUUID } from '@/domains/shared/types/common'
import type { ITagPreview } from '@/domains/tags/types/tag.type'

export type TAllocationStatus = 'PENDING' | 'ALLOCATED' | 'PARTIALLY_ALLOCATED'

// Main Invoice interface
export interface IInvoice {
  id: TUUID;
  tenantId: string;
  type: TInvoiceType;
  status: TInvoiceStatus;
  approvalStatus: TApprovalStatus;
  deliveryStatus: TDeliveryStatus;
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
  tags: ITagPreview[];
  issueDate?: TDate | null;
  createdAt?: TDateTime | null;
  updatedAt?: TDateTime | null;
  numberingTemplate?: IInvoiceNumberingTemplate;
}

export interface IInvoiceCreate {
  type: TInvoiceType;
  issueDate: TDate;
  status?: string;
  statusInfo?: {
    general?: TInvoiceStatus;
    ocr?: TApprovalStatus;
    allocation?: TAllocationStatus;
    approval?: TApprovalStatus;
    delivery?: TDeliveryStatus;
    payment?: TPaymentStatus;
  };
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
  numberingTemplate?: IInvoiceNumberingTemplate;
}

