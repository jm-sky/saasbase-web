import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { money } from '@/lib/money'
import type { ITemplatePreviewOptions } from '../services/InvoiceTemplate.service'
import type { Ref } from 'vue'


export const useGetSampleData = (previewOptions: Ref<ITemplatePreviewOptions>) => {
  const { locale } = useI18n()
  
  // Use a computed ref to make locale dependency explicit and prevent recursion
  const currentLocale = computed(() => previewOptions.value.language ?? locale.value)

  const getCurrencySymbol = (currency: string) => {
    const symbols: Record<string, string> = {
      PLN: 'zł',
      USD: '$',
      EUR: '€',
      UAH: '₴',
      RUB: '₽'
    }
    return symbols[currency] || currency
  }

  const getSampleData = () => {
    return {
      invoice: {
        id: '01HZ123456789',
        number: 'PREVIEW-001',
        type: 'invoice',
        status: 'issued',
        formattedTotalNet: money(1000.00, previewOptions.value.currency, currentLocale.value),
        formattedTotalTax: money(230.00, previewOptions.value.currency, currentLocale.value),
        formattedTotalGross: money(1230.00, previewOptions.value.currency, currentLocale.value),
        currency: previewOptions.value.currency,
        currencySymbol: getCurrencySymbol(previewOptions.value.currency ?? 'USD'),
        issueDate: '2024-07-06',
        dueDate: '2024-08-05',
        seller: {
          name: 'Example Company Sp. z o.o.',
          address: 'ul. Przykładowa 123, 00-001 Warszawa',
          country: 'Polska',
          taxId: '1234567890',
          email: 'kontakt@example.com',
          logoUrl: previewOptions.value.includeLogo ? '/sample-logo.png' : null
        },
        buyer: {
          name: 'Client Company Ltd.',
          address: '456 Client Street, Warsaw',
          country: 'Poland',
          taxId: '0987654321',
          email: 'client@example.com'
        },
        lines: [
          {
            id: '01HZ123456790',
            description: 'Web Development Services',
            formattedQuantity: '40.00',
            formattedUnitPrice: money(20.00, previewOptions.value.currency, currentLocale.value),
            formattedTotalNet: money(800.00, previewOptions.value.currency, currentLocale.value),
            formattedTotalVat: money(184.00, previewOptions.value.currency, currentLocale.value),
            formattedTotalGross: money(984.00, previewOptions.value.currency, currentLocale.value),
            vatRateName: 'Standard VAT',
            vatRateValue: 23.0
          },
          {
            id: '01HZ123456791',
            description: 'Consulting Services',
            formattedQuantity: '10.00',
            formattedUnitPrice: money(20.00, previewOptions.value.currency, currentLocale.value),
            formattedTotalNet: money(200.00, previewOptions.value.currency, currentLocale.value),
            formattedTotalVat: money(46.00, previewOptions.value.currency, currentLocale.value),
            formattedTotalGross: money(246.00, previewOptions.value.currency, currentLocale.value),
            vatRateName: 'Standard VAT',
            vatRateValue: 23.0
          }
        ],
        vatSummary: [
          {
            vatRateName: 'Standard VAT',
            vatRateValue: 23.0,
            formattedNet: money(1000.00, previewOptions.value.currency, currentLocale.value),
            formattedVat: money(230.00, previewOptions.value.currency, currentLocale.value),
            formattedGross: money(1230.00, previewOptions.value.currency, currentLocale.value)
          }
        ],
        payment: {
          status: 'pending',
          dueDate: '2024-08-05',
          method: 'bank_transfer',
          terms: 'Payment due within 30 days',
          bankAccount: {
            iban: 'PL61109010140000071219812874',
            swift: 'WBKPPLPP',
            bankName: 'Santander Bank Polska'
          }
        }
      },
      options: {
        ...previewOptions.value,
        issuerSignature: previewOptions.value.includeSignatures ? {
          name: 'Jane Smith',
          title: 'Project Manager',
          date: '2024-07-06',
          imageUrl: '/sample-signature.png'
        } : null,
        receiverSignature: previewOptions.value.includeSignatures ? {
          name: 'John Doe',
          title: 'CEO',
          date: null,
          imageUrl: null
        } : null
      }
    }
  }

  const getInvoiceSchema = () => {
    return {
      invoice: {
        type: 'object' as const,
        description: 'Main invoice data',
        properties: {
          id: { type: 'string' as const, description: 'Invoice ID' },
          number: { type: 'string' as const, description: 'Invoice number' },
          type: { type: 'string' as const, description: 'Invoice type' },
          status: { type: 'string' as const, description: 'Invoice status' },
          issueDate: { type: 'string' as const, description: 'Invoice issue date' },
          dueDate: { type: 'string' as const, description: 'Payment due date' },
          currency: { type: 'string' as const, description: 'Currency code' },
          currencySymbol: { type: 'string' as const, description: 'Currency symbol' },
          formattedTotalNet: { type: 'string' as const, description: 'Formatted net total' },
          formattedTotalTax: { type: 'string' as const, description: 'Formatted tax total' },
          formattedTotalGross: { type: 'string' as const, description: 'Formatted gross total' },
          seller: {
            type: 'object' as const,
            description: 'Seller information',
            properties: {
              name: { type: 'string' as const, description: 'Company/seller name' },
              address: { type: 'string' as const, description: 'Seller address' },
              country: { type: 'string' as const, description: 'Seller country' },
              taxId: { type: 'string' as const, description: 'Tax ID/VAT number' },
              email: { type: 'string' as const, description: 'Seller email' },
              logoUrl: { type: 'string' as const, description: 'Logo URL' }
            }
          },
          buyer: {
            type: 'object' as const,
            description: 'Buyer information',
            properties: {
              name: { type: 'string' as const, description: 'Buyer name' },
              address: { type: 'string' as const, description: 'Buyer address' },
              country: { type: 'string' as const, description: 'Buyer country' },
              taxId: { type: 'string' as const, description: 'Buyer tax ID' },
              email: { type: 'string' as const, description: 'Buyer email' }
            }
          },
          lines: {
            type: 'array' as const,
            description: 'Invoice line items',
            items: {
              type: 'object' as const,
              properties: {
                id: { type: 'string' as const, description: 'Line item ID' },
                description: { type: 'string' as const, description: 'Item description' },
                formattedQuantity: { type: 'string' as const, description: 'Formatted quantity' },
                formattedUnitPrice: { type: 'string' as const, description: 'Formatted unit price' },
                formattedTotalNet: { type: 'string' as const, description: 'Formatted net amount' },
                formattedTotalVat: { type: 'string' as const, description: 'Formatted VAT amount' },
                formattedTotalGross: { type: 'string' as const, description: 'Formatted gross amount' },
                vatRateName: { type: 'string' as const, description: 'VAT rate name' },
                vatRateValue: { type: 'number' as const, description: 'VAT rate percentage' }
              }
            }
          },
          vatSummary: {
            type: 'array' as const,
            description: 'VAT summary by rate',
            items: {
              type: 'object' as const,
              properties: {
                vatRateName: { type: 'string' as const, description: 'VAT rate name' },
                vatRateValue: { type: 'number' as const, description: 'VAT rate percentage' },
                formattedNet: { type: 'string' as const, description: 'Formatted net amount' },
                formattedVat: { type: 'string' as const, description: 'Formatted VAT amount' },
                formattedGross: { type: 'string' as const, description: 'Formatted gross amount' }
              }
            }
          },
          payment: {
            type: 'object' as const,
            description: 'Payment information',
            properties: {
              status: { type: 'string' as const, description: 'Payment status' },
              method: { type: 'string' as const, description: 'Payment method' },
              dueDate: { type: 'string' as const, description: 'Payment due date' },
              terms: { type: 'string' as const, description: 'Payment terms' },
              bankAccount: {
                type: 'object' as const,
                description: 'Bank account details',
                properties: {
                  iban: { type: 'string' as const, description: 'IBAN number' },
                  swift: { type: 'string' as const, description: 'SWIFT code' },
                  bankName: { type: 'string' as const, description: 'Bank name' }
                }
              }
            }
          }
        }
      },
      options: {
        type: 'object' as const,
        description: 'Template options',
        properties: {
          includeSignatures: { type: 'boolean' as const, description: 'Include signature blocks' },
          language: { type: 'string' as const, description: 'Template language' },
          currency: { type: 'string' as const, description: 'Template currency' },
          accentColor: { type: 'string' as const, description: 'Accent color' },
          includeLogo: { type: 'boolean' as const, description: 'Include logo' }
        }
      }
    }
  }

  return {
    getSampleData,
    getInvoiceSchema,
  }
}
