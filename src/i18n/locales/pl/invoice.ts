export default {
  title: 'Faktury',
  fields: {},
  add: {
    title: 'Dodawanie faktury',
    description: 'Dodaj nową fakturę do systemu',
    success: 'Faktura dodana pomyślnie',
    error: 'Nie udało się dodać faktury',
    submit: 'Zapisz fakturę',
  },
  show: {
    title: 'Faktura',
  },
  delete: {
    confirm: 'Czy na pewno chcesz usunąć tę fakturę?',
    success: 'Faktura usunięta pomyślnie',
    error: 'Nie udało się usunąć faktury',
  },
  batchActions: {
    selected: 'Wybrane',
    clearSelection: 'Wyczyść wybrane',
    deleteMultiple: 'Usuń wybrane',
  },
  actions: {
    create: 'Dodaj fakturę',
    settings: 'Ustawienia faktury',
    changeStatus: {
      title: 'Zmień status',
      success: 'Status zmieniony pomyślnie',
      error: 'Nie udało się zmienić statusu',
    },
    copy: {
      title: 'Kopiuj',
      success: 'Faktura skopiowana pomyślnie',
      error: 'Nie udało się skopiować faktury',
    },
    generatePdf: {
      title: 'Generuj PDF',
      original: 'PDF oryginalny',
      duplicate: 'PDF duplikat',
    },
    sendEmail: {
      title: 'Wyślij e-mail',
      success: 'E-mail wysłany pomyślnie',
      error: 'Nie udało się wysłać e-maila',
    },
    sendToKsef: {
      title: 'Wyślij do KSeF',
      success: 'Wysłano do KSeF pomyślnie',
      error: 'Nie udało się wysłać do KSeF',
    },
    shareLink: {
      title: 'Udostępnij link',
      success: 'Link publiczny skopiowany do schowka',
      error: 'Nie udało się wygenerować linku publicznego',
    },
    exportBank: {
      title: 'Eksportuj przelew bankowy',
      success: 'Pakiet przelewu bankowego wyeksportowany pomyślnie',
      error: 'Nie udało się wyeksportować pakietu przelewu bankowego',
    },
    payment: {
      title: 'Zarządzaj płatnością',
      attach: 'Dołącz płatność',
      generate: 'Wygeneruj płatność',
    },
    relationships: {
      title: 'Zarządzaj relacjami',
      project: 'Połącz z projektem',
      user: 'Połącz z użytkownikiem',
      contractor: 'Połącz z wykonawcą',
    },
    reminders: {
      title: 'Zarządzaj przypomnieniami',
      success: 'Przypomnienia zarządzane pomyślnie',
      error: 'Nie udało się zarządzać przypomnieniami',
    },
    recurring: {
      title: 'Skonfiguruj cykliczną',
      success: 'Faktura cykliczna skonfigurowana pomyślnie',
      error: 'Nie udało się skonfigurować faktury cyklicznej',
    },
  },
}
