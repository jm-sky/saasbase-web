import type { IInvoiceLine, IInvoiceVatSummary } from '@/domains/financial/types/financial.type'

export interface ICalculatedLine extends IInvoiceLine {
  totalNet: number
  totalVat: number
  totalGross: number
}

export interface ICalculatedTotals {
  totalNet: number
  totalTax: number
  totalGross: number
  vatSummary: IInvoiceVatSummary[]
}

export function calculateLineTotal(line: IInvoiceLine): ICalculatedLine {
  const totalNet = line.quantity * line.unitPrice
  const totalVat = totalNet * (line.vatRate.rate / 100)
  const totalGross = totalNet + totalVat

  return {
    ...line,
    totalNet: Math.round(totalNet * 100) / 100,
    totalVat: Math.round(totalVat * 100) / 100,
    totalGross: Math.round(totalGross * 100) / 100,
  }
}

export function calculateInvoiceTotals(lines: IInvoiceLine[]): ICalculatedTotals {
  const calculatedLines = lines.map(calculateLineTotal)
  
  // Group by VAT rate
  const vatGroups = new Map<string, { rate: number; category?: string; net: number; vat: number }>()
  
  calculatedLines.forEach(line => {
    const key = `${line.vatRate.rate}-${line.vatRate.category || 'default'}`
    if (!vatGroups.has(key)) {
      vatGroups.set(key, {
        rate: line.vatRate.rate,
        category: line.vatRate.category,
        net: 0,
        vat: 0,
      })
    }
    
    const group = vatGroups.get(key)!
    group.net += line.totalNet
    group.vat += line.totalVat
  })
  
  // Create VAT summary
  const vatSummary: IInvoiceVatSummary[] = Array.from(vatGroups.values()).map(group => ({
    vatRate: {
      rate: group.rate,
      category: group.category,
    },
    net: Math.round(group.net * 100) / 100,
    vat: Math.round(group.vat * 100) / 100,
    gross: Math.round((group.net + group.vat) * 100) / 100,
  }))
  
  // Calculate totals
  const totalNet = calculatedLines.reduce((sum, line) => sum + line.totalNet, 0)
  const totalTax = calculatedLines.reduce((sum, line) => sum + line.totalVat, 0)
  const totalGross = totalNet + totalTax
  
  return {
    totalNet: Math.round(totalNet * 100) / 100,
    totalTax: Math.round(totalTax * 100) / 100,
    totalGross: Math.round(totalGross * 100) / 100,
    vatSummary,
  }
}

export function validateCalculations(lines: IInvoiceLine[], totals: ICalculatedTotals): boolean {
  const calculated = calculateInvoiceTotals(lines)
  
  return (
    Math.abs(calculated.totalNet - totals.totalNet) < 0.01 &&
    Math.abs(calculated.totalTax - totals.totalTax) < 0.01 &&
    Math.abs(calculated.totalGross - totals.totalGross) < 0.01
  )
}