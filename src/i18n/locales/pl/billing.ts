export const billing = {
  title: 'Rozliczenia',
  billingCustomer: {
    title: 'Klient rozliczeniowy',
    fields: {
      name: 'Nazwa',
      address: 'Adres',
    },
    update: {
      error: 'Błąd podczas aktualizacji informacji rozliczeniowych',
    },
  },
  checkout: {
    success: {
      title: 'Płatność zakończona pomyślnie',
      description: 'Twoja subskrypcja została pomyślnie zakupiona.',
    },
    cancelled: {
      title: 'Płatność anulowana',
      description: 'Twoja subskrypcja została anulowana.',
    },
  },
}