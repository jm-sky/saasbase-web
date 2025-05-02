import { type TDate, type TDateTime } from '@/domains/shared/types/common'
import { type TInvoiceStatus } from '@/domains/shared/types/index'

export interface IInvoice {
  id: string
  tenantId: string
  contractorId: string
  invoiceTypeId: string
  invoiceNumber: string
  issueDate: TDate
  dueDate: TDate
  totalNet: number
  totalTax: number
  totalGross: number
  status: TInvoiceStatus
  createdAt: TDateTime
  updatedAt: TDateTime
}

export type IInvoiceCreate = Omit<IInvoice, 'id' | 'createdAt' | 'updatedAt'>

export class Invoice {
  static load(data: IInvoice): Invoice {
    if (!data.id) throw new Error('Invoice ID is required')
    if (!data.tenantId) throw new Error('Tenant ID is required')
    if (!data.contractorId) throw new Error('Contractor ID is required')
    if (!data.invoiceTypeId) throw new Error('Invoice type ID is required')
    if (!data.invoiceNumber) throw new Error('Invoice number is required')
    if (!data.issueDate) throw new Error('Issue date is required')
    if (!data.dueDate) throw new Error('Due date is required')
    if (data.totalNet < 0) throw new Error('Total net amount must be non-negative')
    if (data.totalTax < 0) throw new Error('Total tax amount must be non-negative')
    if (data.totalGross < 0) throw new Error('Total gross amount must be non-negative')

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

  toJSON(): IInvoice {
    return { ...this.data }
  }

  equals(other: Invoice): boolean {
    return this.id === other.id
  }

  isValid(): boolean {
    return Boolean(
      this.id &&
      this.tenantId &&
      this.contractorId &&
      this.invoiceTypeId &&
      this.invoiceNumber &&
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      this.issueDate &&
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      this.dueDate &&
      this.totalNet >= 0 &&
      this.totalTax >= 0 &&
      this.totalGross >= 0 &&
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      this.status &&
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      this.createdAt &&
      this.updatedAt
    )
  }

  isOverdue(): boolean {
    return this.dueDate < new Date() && this.status !== 'paid'
  }

  isPaid(): boolean {
    return this.status === 'paid'
  }

  isDraft(): boolean {
    return this.status === 'draft'
  }
}
