import { type TInvoiceStatus } from '@/types'

export interface IInvoice {
  id: string
  tenantId: string
  contractorId: string
  invoiceTypeId: string
  invoiceNumber: string
  issueDate: string
  dueDate: string
  totalNet: number
  totalTax: number
  totalGross: number
  status: TInvoiceStatus
  createdAt: string
  updatedAt: string
}

export class Invoice {
  static load(data: IInvoice): Invoice {
    return new Invoice(data)
  }

  constructor(private data: IInvoice) {}

  get id(): string {
    return this.data.id
  }

  get tenantId(): string {
    return this.data.tenantId
  }

  get contractorId(): string {
    return this.data.contractorId
  }

  get invoiceTypeId(): string {
    return this.data.invoiceTypeId
  }

  get invoiceNumber(): string {
    return this.data.invoiceNumber
  }

  get issueDate(): Date {
    return new Date(this.data.issueDate)
  }

  get dueDate(): Date {
    return new Date(this.data.dueDate)
  }

  get totalNet(): number {
    return this.data.totalNet
  }

  get totalTax(): number {
    return this.data.totalTax
  }

  get totalGross(): number {
    return this.data.totalGross
  }

  get status(): TInvoiceStatus {
    return this.data.status
  }

  get createdAt(): Date {
    return new Date(this.data.createdAt)
  }

  get updatedAt(): Date {
    return new Date(this.data.updatedAt)
  }
}
