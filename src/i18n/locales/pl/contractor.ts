export const contractor = {
  title: 'Kontrahenci',
  contractorDetails: 'Szczegóły kontrahenta',
  fields: {
    name: 'Nazwa',
    country: 'Kraj',
    type: 'Typ',
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
    supplier: 'Dostawca',
    buyer: 'Kupujący',
  },
  type: {
    company: 'Firma',
    individual: 'Osoba fizyczna',
    organization: 'Organizacja',
    institution: 'Instytucja',
    government: 'Urząd',
    non_profit: 'Organizacja non-profit',
    other: 'Inne',
  },
  add: {
    title: 'Dodaj kontrahenta',
    description: 'Dodaj nowego kontrahenta do systemu.',
    success: 'Kontrahent dodany pomyślnie',
    error: 'Nie udało się dodać kontrahenta',
    fetchLogo: 'Wyszukaj logo',
    fetchLogoDescription: 'Spróbuj pobrać logo z Internetu na podstawie strony internetowej lub e-maila',
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
  overview: {
    title: 'Przegląd',
    description: 'Przegląd kontrahenta.',
  },
  comments: {
    title: 'Komentarze',
    description: 'Komentarze kontrahenta.',
  },
  logs: {
    title: 'Logi',
    description: 'Logi kontrahenta.',
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
  },
  preferences: {
    title: 'Preferencje',
    description: 'Preferencje kontrahenta.',
    success: 'Preferencje zaktualizowane pomyślnie',
    error: 'Nie udało się zaktualizować preferencji',
    fields: {
      defaultPaymentMethodId: 'Domyślna metoda płatności',
      defaultCurrency: 'Domyślna waluta',
      defaultLanguage: 'Domyślny język',
      defaultPaymentDays: 'Domyślne dni płatności',
      defaultTags: 'Domyślne tagi',
      defaultPaymentMethod: 'Domyślna metoda płatności',
    },
  },
}
