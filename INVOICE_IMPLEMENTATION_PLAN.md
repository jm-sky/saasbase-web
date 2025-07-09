# Invoice Implementation Plan

## Project Context
- **Goal**: Finish `/src/pages/invoice/AddInvoicePage.vue` to match backend schema
- **Backend Schema**: `/home/madeyskij/projects/saasbase/saasbase-web/.docs/invoice-creation-api.json`
- **Current Screen**: `/home/madeyskij/projects/saasbase/saasbase-web/public/images/landing/add-invoice.png`

## Architecture Overview
- **Framework**: Vue 3 with Composition API + TypeScript
- **Form Library**: Vee-Validate + Zod for validation
- **State Management**: Pinia
- **Styling**: TailwindCSS v4
- **UI Components**: Radix Vue & Reka UI (ShadCn-Vue)

## Progress Status

### ✅ COMPLETED
1. **Analyzed existing patterns and partial components**
   - Confirmed existing pickers: ContractorPicker, ProductPicker, VatRatePicker, CurrencyPicker, CountryPicker
   - Reviewed partial components: InvoiceBuyerBox, InvoiceSellerBox, InvoiceLinesEditable, etc.

2. **Created validation schemas** (`/src/domains/invoice/validation/invoice.schema.ts`)
   - Main `invoiceCreateSchema` matching backend requirements
   - Individual schemas: contractorSchema, vatRateSchema, invoiceLineSchema, etc.
   - Full compliance with backend validation rules

3. **Updated invoice types** (`/src/domains/invoice/types/invoice.type.ts` & `/src/domains/financial/types/financial.type.ts`)
   - Updated IInvoiceCreate to match backend schema (type: 'IN'|'OUT', statusInfo structure)
   - Updated IInvoiceLine with proper vatRate structure and gtuCodes
   - Updated IInvoicePayment with proper enums and bankAccount structure

4. **Implemented form calculations** (`/src/domains/invoice/helpers/invoiceCalculations.ts`)
   - `calculateLineTotal()` - calculates net, vat, gross for individual lines
   - `calculateInvoiceTotals()` - calculates totals and VAT summary
   - `validateCalculations()` - validates calculation accuracy

5. **Enhanced InvoiceLinesEditable component**
   - Added proper Vee-Validate integration with useFieldArray
   - Integrated calculation helpers for real-time updates
   - Added VatRatePicker integration
   - Proper event handlers for quantity, price, description changes

6. **Updated AddInvoicePage to use proper Vee-Validate patterns**
   - ✅ Integrated validation schema with `toTypedSchema(invoiceCreateSchema)`
   - ✅ Updated form initialization with correct types and values
   - ✅ Fixed type mismatches for backend schema compliance
   - ✅ Updated createLine function to match new schema structure

7. **Created missing partial components**
   - ✅ InvoicePaymentSection.vue - Payment details with bank account support
   - ✅ InvoiceOptionsSection.vue - Email settings and template selection
   - ✅ FormFieldError.vue - Reusable error display component

8. **Added proper error handling and validation**
   - ✅ Integrated Zod schema with Vee-Validate using toTypedSchema
   - ✅ Added FormFieldError component for field-level validation display
   - ✅ Maintained existing API error handling with toast notifications

### ✅ COMPLETED
9. **Test the complete invoice creation flow**
   - ✅ Basic form structure completed
   - ✅ Fixed TypeScript errors
   - ✅ Improved UX: moved delete button to right side of invoice lines
   - ✅ Added proper money formatting using `money` helper
   - ✅ Enhanced table layout with proper column alignment

10. **UI/UX Improvements**
   - ✅ Consolidated payment fields in sidebar to reduce duplication
   - ✅ Added visual indicators (color bullets) for payment status
   - ✅ Simplified main form by moving payment details to sidebar
   - ✅ Implemented smart language defaulting (buyer preference > current locale)
   - ✅ Simplified VAT rate display in invoice lines
   - ✅ Improved sidebar layout with better organization

11. **Enhanced Form Features**
   - ✅ Added required field indicators (red asterisk) to Label component
   - ✅ Translated payment method values (no more "BANK_TRANSFER" raw values)
   - ✅ Enhanced useTenant composable with bank account loading
   - ✅ Bank account auto-population from tenant default account
   - ✅ Fixed TenantBankAccountPicker display issues
   - ✅ Proper bank account selection with IBAN matching

## Current Files Modified/Created

### Created Files
- `/src/domains/invoice/validation/invoice.schema.ts` - Zod validation schemas
- `/src/domains/invoice/helpers/invoiceCalculations.ts` - Calculation helpers
- `/src/pages/invoice/partials/InvoicePaymentSection.vue` - Payment details component
- `/src/pages/invoice/partials/InvoiceOptionsSection.vue` - Email & template options
- `/src/components/Form/FormFieldError.vue` - Reusable error display component
- `INVOICE_IMPLEMENTATION_PLAN.md` - This plan file

### Modified Files
- `/src/domains/invoice/types/invoice.type.ts` - Updated IInvoiceCreate interface
- `/src/domains/financial/types/financial.type.ts` - Updated line, payment, body interfaces
- `/src/pages/invoice/partials/InvoiceLinesEditable.vue` - Added vee-validate integration
- `/src/pages/invoice/AddInvoicePage.vue` - Integrated validation schema and new components

### Implementation Complete
All major components have been implemented and integrated. The invoice creation form now:
- ✅ Matches backend schema requirements
- ✅ Has proper validation with Zod + Vee-Validate
- ✅ Includes real-time calculations
- ✅ Has comprehensive payment and options sections
- ✅ Uses proper error handling

## Backend Schema Key Requirements

### Invoice Creation Endpoint
- **Method**: POST `/api/v1/invoices`
- **Required Fields**: type, issueDate, number, numberingTemplateId, totals, currency, exchangeRate, seller, buyer, body, payment, options

### Data Structure
```typescript
{
  type: 'IN' | 'OUT',
  issueDate: string (YYYY-MM-DD),
  statusInfo: { general, ocr, allocation, approval, delivery, payment },
  number: string,
  numberingTemplateId: string,
  totals: { totalNet, totalTax, totalGross },
  currency: string (ISO 4217),
  exchangeRate: number,
  seller: IInvoiceSeller,
  buyer: IInvoiceBuyer,
  body: {
    lines: IInvoiceLine[],
    vatSummary: IInvoiceVatSummary[],
    exchange: IInvoiceExchange,
    description?: string
  },
  payment: IInvoicePayment,
  options: IInvoiceOptions
}
```

## Available Services (Don't Duplicate)
- `contractorService` - for buyer/seller lookup
- `productService` - for product lookup  
- `vatRateService` - for VAT rates
- `currencyService` - for currencies
- `countryService` - for countries
- `exchangeRateService` - for exchange rates
- `paymentMethodService` - for payment methods
- `measurementUnitService` - for units
- `tagService` - for tags
- `numberingTemplateService` - for invoice numbering

## Next Steps
1. Update AddInvoicePage.vue to use validation schema
2. Fix type mismatches in form initialization
3. Create payment and options partial components
4. Add proper error handling and validation display
5. Test the complete flow

## Key Patterns to Follow
- Use `useForm` with Zod schema for validation
- Use `useFieldArray` for dynamic line items
- Use `setFieldValue` instead of v-model for complex nested objects
- Implement real-time calculations on field changes
- Follow existing picker component patterns
- Use proper error handling with toast notifications

## Questions/Decisions Made
- ✅ Use existing services instead of creating new lookup endpoints
- ✅ Implement real-time calculations in form
- ✅ Use proper Vee-Validate patterns for nested forms
- ✅ Match backend schema exactly for API compatibility