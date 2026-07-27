import { z } from 'zod'
import { invoiceTypes } from '@/domains/financial/data/statuses'

// Base schemas
const contractorSchema = z.object({
  contractorId: z.string().nullable().optional(),
  contractorType: z.string().nullable().optional(),
  name: z.string().min(1, 'Name is required').max(255),
  address: z.string().max(500).optional(),
  country: z.string().length(2).optional(),
  taxId: z.string().max(50).nullable().optional(),
  iban: z.string().max(34).nullable().optional(),
  email: z.string().email().max(255).nullable().optional(),
})

const vatRateSchema = z.object({
  id: z.string().min(1, 'VAT rate is required'),
  rate: z.number().min(0).max(100),
  name: z.string().max(255).optional(),
  type: z.string().max(255).optional(),
})

const invoiceLineSchema = z.object({
  id: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  quantity: z.number().min(0),
  unitPrice: z.number().min(0),
  vatRate: vatRateSchema,
  totalNet: z.number().min(0),
  totalVat: z.number().min(0),
  totalGross: z.number().min(0),
  productId: z.string().nullable().optional(),
  gtuCodes: z.array(z.string().max(10)).optional(),
})

const exchangeSchema = z.object({
  currency: z.string().length(3),
  exchangeRate: z.number().min(0).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
})

const bodySchema = z.object({
  lines: z.array(invoiceLineSchema),
  exchange: exchangeSchema,
  description: z.string().max(2000).nullable().optional(),
})

const bankAccountSchema = z.object({
  name: z.string().max(255).nullable().optional(),
  iban: z.string().max(34).nullable().optional(),
  swift: z.string().max(11).nullable().optional(),
  address: z.string().max(500).nullable().optional(),
})

const paymentMethodSchema = z.object({
  id: z.string().max(255).nullable().optional(),
  name: z.string().max(255).nullable().optional(),
  paymentDays: z.number().min(0).nullable().optional(),
}).nullable().optional()

const paymentSchema = z.object({
  status: z.enum(['pending', 'paid', 'partiallyPaid', 'overdue', 'cancelled']),
  dueDate: z.string().nullable().optional(),
  paidDate: z.string().nullable().optional(),
  paidAmount: z.number().min(0).nullable().optional(),
  method: paymentMethodSchema,
  reference: z.string().max(255).nullable().optional(),
  terms: z.string().max(500).nullable().optional(),
  notes: z.string().max(1000).nullable().optional(),
  bankAccount: bankAccountSchema.nullable().optional(),
})

// Main expense creation schema (note: no numberingTemplateId as expenses don't use numbering templates)
export const expenseCreateSchema = z.object({
  type: z.enum(invoiceTypes as [string, ...string[]]),
  issueDate: z.string(),
  status: z.string().optional(),
  number: z.string().max(255),
  totalNet: z.number().min(0),
  totalTax: z.number().min(0),
  totalGross: z.number().min(0),
  currency: z.string().length(3),
  exchangeRate: z.number().min(0),
  seller: contractorSchema,
  buyer: contractorSchema,
  body: bodySchema,
  payment: paymentSchema,
})

// Export individual schemas for reuse
export {
  bankAccountSchema,
  bodySchema,
  contractorSchema,
  exchangeSchema,
  invoiceLineSchema,
  paymentSchema,
  vatRateSchema,
}

export type TExpenseCreateSchema = z.infer<typeof expenseCreateSchema>
