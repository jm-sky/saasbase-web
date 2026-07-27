import { describe, expect, it } from 'vitest'
import { buildPublicInvoiceShareUrl } from './invoiceShareTokenService'

describe('buildPublicInvoiceShareUrl', () => {
  it('builds guest route under app origin', () => {
    expect(buildPublicInvoiceShareUrl('tok_abc', 'https://app.example.com')).toBe(
      'https://app.example.com/shared/invoices/tok_abc',
    )
  })
})
