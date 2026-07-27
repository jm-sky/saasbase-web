import type { DataSchema } from '../types/invoiceTemplateEditor.type'

export const getInvoiceTemplateSchema = (): DataSchema => ({
  invoice: {
    type: 'object',
    description: 'Main invoice data',
    properties: {
      id: { type: 'string', description: 'Invoice ID' },
      number: { type: 'string', description: 'Invoice number' },
      type: { type: 'string', description: 'Invoice type' },
      status: { type: 'string', description: 'Invoice status' },
      issueDate: { type: 'string', description: 'Invoice issue date' },
      dueDate: { type: 'string', description: 'Payment due date' },
      description: { type: 'string', description: 'Invoice description' },
      currency: { type: 'string', description: 'Currency code' },
      currencySymbol: { type: 'string', description: 'Currency symbol' },
      formattedTotalNet: { type: 'string', description: 'Formatted net total' },
      formattedTotalTax: { type: 'string', description: 'Formatted tax total' },
      formattedTotalGross: { type: 'string', description: 'Formatted gross total' },
      seller: {
        type: 'object',
        description: 'Seller information',
        properties: {
          name: { type: 'string', description: 'Company/seller name' },
          address: { type: 'string', description: 'Seller address' },
          country: { type: 'string', description: 'Seller country' },
          taxId: { type: 'string', description: 'Tax ID/VAT number' },
          email: { type: 'string', description: 'Seller email' },
          logoUrl: { type: 'string', description: 'Logo URL' }
        }
      },
      buyer: {
        type: 'object',
        description: 'Buyer information',
        properties: {
          name: { type: 'string', description: 'Buyer name' },
          address: { type: 'string', description: 'Buyer address' },
          country: { type: 'string', description: 'Buyer country' },
          taxId: { type: 'string', description: 'Buyer tax ID' },
          email: { type: 'string', description: 'Buyer email' }
        }
      },
      lines: {
        type: 'array',
        description: 'Invoice line items',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Line item ID' },
            description: { type: 'string', description: 'Item description' },
            formattedQuantity: { type: 'string', description: 'Formatted quantity' },
            formattedUnitPrice: { type: 'string', description: 'Formatted unit price' },
            formattedTotalNet: { type: 'string', description: 'Formatted net amount' },
            formattedTotalVat: { type: 'string', description: 'Formatted VAT amount' },
            formattedTotalGross: { type: 'string', description: 'Formatted gross amount' },
            vatRateName: { type: 'string', description: 'VAT rate name' },
            vatRateValue: { type: 'number', description: 'VAT rate percentage' }
          }
        }
      },
      vatSummary: {
        type: 'array',
        description: 'VAT summary by rate',
        items: {
          type: 'object',
          properties: {
            vatRateName: { type: 'string', description: 'VAT rate name' },
            vatRateValue: { type: 'number', description: 'VAT rate percentage' },
            formattedNet: { type: 'string', description: 'Formatted net amount' },
            formattedVat: { type: 'string', description: 'Formatted VAT amount' },
            formattedGross: { type: 'string', description: 'Formatted gross amount' }
          }
        }
      },
      payment: {
        type: 'object',
        description: 'Payment information',
        properties: {
          status: { type: 'string', description: 'Payment status' },
          method: { type: 'string', description: 'Payment method' },
          dueDate: { type: 'string', description: 'Payment due date' },
          terms: { type: 'string', description: 'Payment terms' },
          bankAccount: {
            type: 'object',
            description: 'Bank account details',
            properties: {
              iban: { type: 'string', description: 'IBAN number' },
              swift: { type: 'string', description: 'SWIFT code' },
              bankName: { type: 'string', description: 'Bank name' }
            }
          }
        }
      }
    }
  },
  options: {
    type: 'object',
    description: 'Template options',
    properties: {
      includeSignatures: { type: 'boolean', description: 'Include signature blocks' },
      issuerSignature: {
        type: 'object',
        description: 'Issuer signature information',
        properties: {
          name: { type: 'string', description: 'Signatory name' },
          title: { type: 'string', description: 'Signatory title' },
          date: { type: 'string', description: 'Signature date' },
          imageUrl: { type: 'string', description: 'Signature image URL' }
        }
      },
      receiverSignature: {
        type: 'object',
        description: 'Receiver signature information',
        properties: {
          name: { type: 'string', description: 'Signatory name' },
          title: { type: 'string', description: 'Signatory title' },
          date: { type: 'string', description: 'Signature date' },
          imageUrl: { type: 'string', description: 'Signature image URL' }
        }
      }
    }
  }
})
