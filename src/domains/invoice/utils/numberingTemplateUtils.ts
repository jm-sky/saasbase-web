import type { IFormatElement, IInvoiceNumberingTemplate, IInvoiceTypeGroup } from '../types/numberingTemplate.type'
import type { TInvoiceType } from '@/domains/financial/types/financial.type'

export const INVOICE_TYPE_GROUPS: Record<string, { 
  baseType: TInvoiceType; 
  correctionType?: TInvoiceType; 
  labelKey: string 
}> = {
  basic: {
    baseType: 'basic',
    correctionType: 'basic-correction',
    labelKey: 'invoice.numberingTemplate.groups.basic'
  },
  advancePayment: {
    baseType: 'advance-payment',
    correctionType: 'advance-payment-correction',
    labelKey: 'invoice.numberingTemplate.groups.advancePayment'
  },
  export: {
    baseType: 'export',
    correctionType: 'export-correction',
    labelKey: 'invoice.numberingTemplate.groups.export'
  },
  settlement: {
    baseType: 'settlement',
    correctionType: 'settlement-correction',
    labelKey: 'invoice.numberingTemplate.groups.settlement'
  },
  ue: {
    baseType: 'ue',
    correctionType: 'ue-correction',
    labelKey: 'invoice.numberingTemplate.groups.ue'
  },
  debitNote: {
    baseType: 'debit-note',
    correctionType: 'debit-note-correction',
    labelKey: 'invoice.numberingTemplate.groups.debitNote'
  },
  import: {
    baseType: 'import',
    correctionType: 'import-correction',
    labelKey: 'invoice.numberingTemplate.groups.import'
  },
  proforma: {
    baseType: 'proforma',
    labelKey: 'invoice.numberingTemplate.groups.proforma'
  }
}

export const groupTemplatesByInvoiceType = (templates: IInvoiceNumberingTemplate[]): IInvoiceTypeGroup[] => {
  const groups: IInvoiceTypeGroup[] = []

  Object.entries(INVOICE_TYPE_GROUPS).forEach(([key, config]) => {
    const baseTemplates = templates.filter(t => t.invoiceType === config.baseType)
    const correctionTemplates = config.correctionType 
      ? templates.filter(t => t.invoiceType === config.correctionType)
      : []

    groups.push({
      key,
      label: config.labelKey,
      baseType: config.baseType,
      correctionType: config.correctionType,
      templates: {
        base: baseTemplates,
        correction: correctionTemplates
      }
    })
  })

  return groups
}

export const FORMAT_ELEMENTS: IFormatElement[] = [
  { id: 'year4', type: 'year4', value: 'YYYY', placeholder: '2024' },
  { id: 'year2', type: 'year2', value: 'YY', placeholder: '24' },
  { id: 'month', type: 'month', value: 'MM', placeholder: '01' },
  { id: 'number3', type: 'number3', value: 'NNN', placeholder: '001' },
  { id: 'number4', type: 'number4', value: 'NNNN', placeholder: '0001' }
]

export const validateFormat = (format: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  // Must contain at least one number placeholder
  if (!format.includes('NNN') && !format.includes('NNNN')) {
    errors.push('invoice.numberingTemplate.validation.missingNumberPlaceholder')
  }
  
  // Check for invalid placeholders
  const validPlaceholders = ['YYYY', 'YY', 'MM', 'NNN', 'NNNN']
  const placeholderRegex = /[A-Z]{2,4}/g
  const foundPlaceholders = format.match(placeholderRegex) ?? []
  
  foundPlaceholders.forEach(placeholder => {
    if (!validPlaceholders.includes(placeholder)) {
      errors.push('invoice.numberingTemplate.validation.invalidPlaceholder')
    }
  })

  return {
    isValid: errors.length === 0,
    errors
  }
}

export const getInvoiceTypeLabel = (invoiceType: TInvoiceType): string => {
  return `invoice.numberingTemplate.types.${invoiceType}`
}

export const getResetPeriodLabel = (resetPeriod: string): string => {
  return `invoice.numberingTemplate.resetPeriods.${resetPeriod}`
}