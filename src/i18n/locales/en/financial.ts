export const financial = {
  fields: {
    type: 'Type',
    status: 'Status',
    number: 'Number',
    totalNet: 'Total Net',
    totalTax: 'Total Tax',
    totalGross: 'Total Gross',
    payment: 'Payment',
  },
  payment: {
    fields: {
      method: 'Method',
      status: 'Status',
      dueDate: 'Due Date',
    },
    status: {
      pending: 'Pending',
      paid: 'Paid',
      overdue: 'Overdue',
      cancelled: 'Cancelled',
      undefined: ''
    },
    method: {
      bankTransfer: 'Bank transfer',
      cash: 'Cash',
      creditCard: 'Credit card',
      debitCard: 'Debit card',
      paypal: 'Paypal',
      stripe: 'Stripe',
    },
  },
  invoiceType:{
    'basic': 'Basic invoice',
    'basic-correction': 'Correction',
    'advance-payment': 'Advance payment',
    'advance-payment-correction': 'Advance payment correction',
    'export': 'Export invoice',
    'export-correction': 'Export invoice correction',
    'settlement': 'Settlement invoice',
    'settlement-correction': 'Settlement invoice correction',
    'proforma': 'Proforma',
    'ue': 'UE invoice',
    'ue-correction': 'UE invoice correction',
    'debit-note': 'Debit note',
    'debit-note-correction': 'Debit note correction',
    'import': 'Import invoice',
    'import-correction': 'Import invoice correction',
    undefined: ''
  },
  invoiceStatus: {
    draft: 'Draft',
    sent: 'Sent',
    paid: 'Paid',
    partiallyPaid: 'Partially paid',
    overdue: 'Overdue',
    cancelled: 'Cancelled',
    undefined: ''
  },
}