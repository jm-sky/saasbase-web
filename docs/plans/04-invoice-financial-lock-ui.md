# Plan: Invoice financial lock (UI)

## Problem (updated)

Backend lock on PATCH was previously broken by snake_case field names. That is
**already fixed** in `UpdateInvoiceRequest` (camelCase `FINANCIAL_FIELDS` +
`isCompleted()` covering `completed` and `cancelled`). Frontend still allows
editing lines/totals/currency/number on final invoices — user only fails after
submit.

## Scope

Frontend UI lock + `REVIEW_PLAN.md` note. No further backend change.

## Implementation

1. Helper `isInvoiceFinanciallyLocked(status)` → true for `completed` |
   `cancelled` (mirror backend `InvoiceStatus::isCompleted()`).
2. `EditInvoicePage.vue`:
   - Pass `financialLocked` to lines / sidebar / number fields
   - Alert when locked explaining financial fields are read-only
   - Keep non-financial edits if product allows; if whole form is financial-
     heavy, disable submit of financial payload or entire save when locked
3. `InvoiceLinesEditable` + sidebar currency/exchange/number: `disabled` when
   locked.
4. Update `REVIEW_PLAN.md` finding: backend done, UI done.

## Acceptance

- Edit page for completed/cancelled invoice: lines, totals, currency, number
  disabled; clear alert visible.
- Draft/issued: editable as today.

## Out of scope

Server-side re-audit of other financial endpoints; payment-section lock policy
beyond fields in `FINANCIAL_FIELDS`.
