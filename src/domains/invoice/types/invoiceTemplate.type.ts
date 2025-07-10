import type { TUUID } from '@/domains/shared/types/common'

export type TemplateCategory =
  | 'invoice'
  | 'quote'
  | 'receipt'
  | 'estimate'
  | 'credit_note'

export interface IInvoiceTemplatePreview {
  id: TUUID
  name: string
  description?: string
  category: TemplateCategory
  settings?: Record<string, unknown>
  isActive: boolean
  isDefault: boolean
  isSystem: boolean
}

export interface IInvoiceTemplate {
  id: TUUID
  tenantId?: TUUID
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
