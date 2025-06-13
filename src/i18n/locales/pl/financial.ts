export const financial = {
  fields: {
    type: 'Typ',
    status: 'Status',
    number: 'Numer',
    totalNet: 'Netto',
    totalTax: 'VAT',
    totalGross: 'Brutto',
    payment: 'Płatność',
  },
  payment: {
    fields: {
      method: 'Metoda',
      status: 'Status',
      dueDate: 'Termin płatności',
    },
    status: {
      pending: 'Oczekuje',
      paid: 'Opłacona',
      overdue: 'Zaległa',
      cancelled: 'Anulowana',
      undefined: ''
    },
    method: {
      bankTransfer: 'Przelew bankowy',
      cash: 'Gotówka',
      creditCard: 'Karta kredytowa',
      debitCard: 'Karta debetowa',
      paypal: 'Paypal',
      stripe: 'Stripe',
    },
  },
  invoiceType:{
    'basic': 'Faktura podstawowa',
    'basic-correction': 'Korekta',
    'advance-payment': 'Faktura zaliczka',
    'advance-payment-correction': 'Faktura zaliczka korekta',
    'export': 'Faktura eksport towarów',
    'export-correction': 'Faktura eksport towarów korekta',
    'settlement': 'Faktura końcowa do zaliczki',
    'settlement-correction': 'Faktura końcowa do zaliczki korekta',
    'proforma': 'Proforma',
    'ue': 'Faktura sprzedaży UE',
    'ue-correction': 'Faktura sprzedaży UE korekta',
    'debit-note': 'Nota obciążeniowa',
    'debit-note-correction': 'Nota obciążeniowa korekta',
    'import': 'Faktura import towarów',
    'import-correction': 'Faktura import towarów korekta',
    undefined: ''
  },
  invoiceStatus: {
    draft: 'Wersja robocza',
    ocrProcessing: 'OCR przetwarzanie',
    sent: 'Wysłana',
    paid: 'Opłacona',
    partiallyPaid: 'Częściowo opłacona',
    overdue: 'Zaległa',
    cancelled: 'Anulowana',
    undefined: ''
  },
}