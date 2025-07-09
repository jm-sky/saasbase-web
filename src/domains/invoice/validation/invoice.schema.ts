import { z } from 'zod'

// Base schemas
const contractorSchema = z.object({
  contractorId: z.string().optional(),
  contractorType: z.string().optional(),
  name: z.string().min(1, 'Name is required').max(255),
  address: z.string().max(500).optional(),
  country: z.string().length(2).optional(),
  taxId: z.string().max(50).optional(),
  iban: z.string().max(34).optional(),
  email: z.string().email().max(255).optional(),
})

const vatRateSchema = z.object({
  rate: z.number().min(0).max(100),
  category: z.string().max(50).optional(),
})

const invoiceLineSchema = z.object({
  id: z.string().max(255),
  description: z.string().max(1000).optional(),
  quantity: z.number().min(0),
  unitPrice: z.number().min(0),
  vatRate: vatRateSchema,
  totalNet: z.number().min(0),
  totalVat: z.number().min(0),
  totalGross: z.number().min(0),
  productId: z.string().optional(),
  gtuCodes: z.array(z.string().max(10)).optional(),
})

const vatSummarySchema = z.object({
  vatRate: vatRateSchema,
  net: z.number().min(0),
  vat: z.number().min(0),
  gross: z.number().min(0),
})

const exchangeSchema = z.object({
  currency: z.string().length(3),
  exchangeRate: z.number().min(0).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
})

const bodySchema = z.object({
  lines: z.array(invoiceLineSchema).min(1, 'At least one line item is required'),
  vatSummary: z.array(vatSummarySchema),
  exchange: exchangeSchema,
  description: z.string().max(2000).optional(),
})

const bankAccountSchema = z.object({
  name: z.string().max(255).optional(),
  iban: z.string().max(34).optional(),
  swift: z.string().max(11).optional(),
  address: z.string().max(500).optional(),
})

const paymentSchema = z.object({
  status: z.enum(['PENDING', 'PAID', 'OVERDUE', 'CANCELLED']),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  paidDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  paidAmount: z.number().min(0).optional(),
  method: z.string().max(255).optional(),
  reference: z.string().max(255).optional(),
  terms: z.string().max(500).optional(),
  notes: z.string().max(1000).optional(),
  bankAccount: bankAccountSchema.optional(),
})

const statusInfoSchema = z.object({
  general: z.enum(['DRAFT', 'SENT', 'PAID', 'CANCELLED', 'OVERDUE']).optional(),
  ocr: z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED']).optional(),
  allocation: z.enum(['PENDING', 'ALLOCATED', 'PARTIALLY_ALLOCATED']).optional(),
  approval: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED']).optional(),
  delivery: z.enum(['PENDING', 'DELIVERED', 'FAILED']).optional(),
  payment: z.enum(['PENDING', 'PAID', 'OVERDUE', 'CANCELLED']).optional(),
})

const optionsSchema = z.object({
  language: z.string().max(5).optional(),
  template: z.string().max(255).optional(),
  sendEmail: z.boolean(),
  emailTo: z.array(z.string().email().max(255)),
})

// Main invoice creation schema
export const invoiceCreateSchema = z.object({
  type: z.enum(['IN', 'OUT']),
  issueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: z.string().optional(),
  statusInfo: statusInfoSchema.optional(),
  number: z.string().max(255),
  numberingTemplateId: z.string(),
  totalNet: z.number().min(0),
  totalTax: z.number().min(0),
  totalGross: z.number().min(0),
  currency: z.string().length(3),
  exchangeRate: z.number().min(0),
  seller: contractorSchema,
  buyer: contractorSchema,
  body: bodySchema,
  payment: paymentSchema,
  options: optionsSchema,
})

// Export individual schemas for reuse
export {
  bankAccountSchema,
  bodySchema,
  contractorSchema,
  exchangeSchema,
  invoiceLineSchema,
  optionsSchema,
  paymentSchema,
  statusInfoSchema,
  vatRateSchema,
  vatSummarySchema,
}

export type TInvoiceCreateSchema = z.infer<typeof invoiceCreateSchema>
