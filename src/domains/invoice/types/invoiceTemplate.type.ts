export type TemplateCategory =
  | 'invoice'
  | 'quote'
  | 'receipt'
  | 'estimate'
  | 'credit_note'

export interface IInvoiceTemplatePreview {
  id: string
  name: string
  description?: string
  category: TemplateCategory
  settings?: Record<string, unknown>
  isActive: boolean
  isDefault: boolean
  isSystem: boolean
}

export interface IInvoiceTemplate {
  id: string
  tenantId?: string
  userId?: string
  name: string
  description?: string
  content: string
  category: TemplateCategory
  previewData?: Record<string, unknown>
  settings?: Record<string, unknown>
  isActive: boolean
  isDefault: boolean
  isSystem: boolean
  createdAt?: string
  updatedAt?: string
}
