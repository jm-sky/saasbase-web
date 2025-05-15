export const bankAccounts = {
  title: 'Rachunki Bankowe',
  fields: {
    iban: 'IBAN',
    swift: 'SWIFT',
    currency: 'Waluta',
    bankName: 'Nazwa Banku',
    description: 'Opis',
  },
  setDefault: 'Ustaw jako domyślne',
  add: {
    title: 'Dodaj Konto Bankowe',
    description: 'Dodaj nowe konto bankowe do kontrahenta',
    error: 'Błąd podczas dodawania konta bankowego',
  },
  edit: {
    title: 'Edytuj Konto Bankowe',
    description: 'Edytuj konto bankowe',
    error: 'Błąd podczas edycji konta bankowego',
  },
  error: {
    fetchingBankAccounts: 'Błąd podczas pobierania kont bankowych',
    settingDefaultBankAccount: 'Błąd podczas ustawiania domyślnego konta bankowego',
  },
  delete: {
    error: 'Błąd podczas usuwania konta bankowego',
    confirmation: 'Czy na pewno chcesz usunąć to konto bankowe?',
  },
}
