import { z } from 'zod'
import { i18n } from '@/i18n'

const { t } = i18n.global

export const resetPeriodSchema = z.enum(['monthly', 'yearly', 'never'])

export const invoiceTypeSchema = z.enum([
  'advance-payment',
  'advance-payment-correction',
  'basic',
  'basic-correction',
  'debit-note',
  'debit-note-correction',
  'export',
  'export-correction',
  'import',
  'import-correction',
  'proforma',
  'settlement',
  'settlement-correction',
  'ue',
  'ue-correction',
])

export const numberingTemplateFormSchema = z.object({
  name: z.string()
    .min(1, t('invoice.numberingTemplate.validation.nameRequired'))
    .min(3, t('invoice.numberingTemplate.validation.nameMinLength')),

  invoiceType: invoiceTypeSchema,

  format: z.string()
    .min(1, t('invoice.numberingTemplate.validation.formatRequired'))
    .refine(
      (format) => format.includes('NNN') || format.includes('NNNN'),
      t('invoice.numberingTemplate.validation.missingNumberPlaceholder')
    ),

  nextNumber: z.number()
    .min(1, t('invoice.numberingTemplate.validation.nextNumberMin'))
    .int(t('invoice.numberingTemplate.validation.nextNumberInt')),

  resetPeriod: resetPeriodSchema,

  prefix: z.string().optional().default(''),

  suffix: z.string().optional().default(''),
})

export type NumberingTemplateFormData = z.infer<typeof numberingTemplateFormSchema>
