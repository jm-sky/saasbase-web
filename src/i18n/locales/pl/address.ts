export const address = {
  title: 'Adresy',
  fields: {
    type: 'Typ',
    country: 'Kraj',
    city: 'Miasto',
    postalCode: 'Kod pocztowy',
    street: 'Ulica',
    building: 'Budynek',
    flat: 'Mieszkanie',
    description: 'Opis',
  },
  type: {
    residence: 'Miejsce zamieszkania',
    billing: 'Miejsce rozliczenia',
    registeredOffice: 'Miejsce rejestracji',
    correspondence: 'Miejsce korespondencji',
    contact: 'Miejsce kontaktu',
  },
  setDefault: 'Ustaw jako domyślny',
  error: {
    fetchingAddresses: 'Błąd podczas pobierania adresów',
    settingDefaultAddress: 'Błąd podczas ustawiania domyślnego adresu',
  },
  add: {
    title: 'Dodaj adres',
    description: 'Dodaj nowy adres do kontrahenta',
    error: 'Błąd podczas dodawania adresu',
  },
  edit: {
    title: 'Edytuj adres',
    description: 'Edytuj adres',
    error: 'Błąd podczas edytowania adresu',
  },
  delete: {
    title: 'Usuń adres',
    description: 'Usuń adres',
    confirmation: 'Czy na pewno chcesz usunąć ten adres?',
    error: 'Błąd podczas usuwania adresu',
  },
}
