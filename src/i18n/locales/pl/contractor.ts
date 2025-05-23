export const contractor = {
  title: 'Kontrahenci',
  contractorDetails: 'Szczegóły kontrahenta',
  fields: {
    name: 'Nazwa',
    vatId: 'NIP',
    regon: 'REGON',
    taxId: 'Identyfikator podatkowy',
    email: 'E-mail',
    phone: 'Telefon',
    website: 'Strona internetowa',
    description: 'Opis',
    tags: 'Tagi',
    roles: 'Role',
    isSupplier: 'Jest dostawcą?',
    isBuyer: 'Jest kupującym?',
  },
  add: {
    title: 'Dodaj kontrahenta',
    description: 'Dodaj nowego kontrahenta do systemu.'
  },
  edit: {
    title: 'Edytuj kontrahenta',
    description: 'Edytuj kontrahenta.',
  },
  delete: {
    success: 'Kontrahent usunięty pomyślnie',
    error: 'Nie udało się usunąć kontrahenta',
    confirm: 'Czy na pewno chcesz usunąć tego kontrahenta?'
  },
  show: {
    error: 'Nie udało się załadować kontrahenta',
  },
  addresses: {
    add: {
      title: 'Dodaj adres',
      description: 'Dodaj nowy adres do kontrahenta.',
    },
    edit: {
      title: 'Edytuj adres',
      description: 'Edytuj adres kontrahenta.',
    },
  }
}
