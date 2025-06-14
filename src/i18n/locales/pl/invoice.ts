export default {
  title: 'Faktury',
  fields: {
    type: 'Typ',
    status: 'Status faktury',
    number: 'Numer',
    numberingTemplateId: 'Szablon numeracji',
    totalNet: 'Netto',
    totalTax: 'VAT',
    totalGross: 'Brutto',
    currency: 'Waluta',
    exchangeRate: 'Kurs wymiany',
    seller: 'Sprzedawca',
    buyer: 'Kupujący',
    data: 'Data',
    payment: 'Płatność',
    options: 'Opcje',
    issueDate: 'Data wystawienia',
    createdAt: 'Data utworzenia',
    updatedAt: 'Data aktualizacji',
    numberingTemplate: 'Szablon numeracji',
  },
  add: {
    title: 'Dodawanie faktury',
    description: 'Dodaj nową fakturę do systemu',
    success: 'Faktura dodana pomyślnie',
    error: 'Nie udało się dodać faktury',
  },
  show: {
    title: 'Faktura',
  },
}