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
  edit: {
    title: 'Edycja faktury',
    description: 'Edytuj istniejącą fakturę',
    success: 'Faktura zaktualizowana pomyślnie',
    error: 'Nie udało się zaktualizować faktury',
    submit: 'Zapisz fakturę',
    financialLocked: 'Ta faktura jest zakończona lub anulowana. Szczegółów finansowych nie można już edytować.',
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
    notImplemented: 'Ta funkcja nie jest jeszcze dostępna.',
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
      description: 'Generuj PDF dla faktury',
      original: {
        title: 'PDF oryginalny',
        success: 'PDF oryginalny wygenerowany pomyślnie',
        error: 'Nie udało się wygenerować PDF oryginalnego',
      },
      duplicate: {
        title: 'PDF duplikat',
        success: 'PDF duplikat wygenerowany pomyślnie',
        error: 'Nie udało się wygenerować PDF duplikatu',
      },
      more: 'Więcej opcji',
      fields: {
        template: 'Szablon',
      },
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
  numberingTemplate: {
    title: 'Szablony numeracji',
    subtitle: 'Zarządzaj szablonami numeracji faktur dla różnych typów faktur',

    groups: {
      basic: 'Faktury podstawowe',
      advancePayment: 'Faktury zaliczkowe',
      export: 'Eksport',
      settlement: 'Rozliczenie',
      ue: 'Sprzedaż UE',
      debitNote: 'Noty obciążeniowe',
      import: 'Import',
      proforma: 'Proforma',
    },

    types: {
      'basic': 'Faktura podstawowa',
      'basic-correction': 'Korekta podstawowa',
      'advance-payment': 'Faktura zaliczkowa',
      'advance-payment-correction': 'Korekta zaliczkowa',
      'export': 'Faktura eksportowa',
      'export-correction': 'Korekta eksportowa',
      'settlement': 'Faktura rozliczeniowa',
      'settlement-correction': 'Korekta rozliczeniowa',
      'proforma': 'Faktura proforma',
      'ue': 'Faktura sprzedaży UE',
      'ue-correction': 'Korekta sprzedaży UE',
      'debit-note': 'Nota obciążeniowa',
      'debit-note-correction': 'Korekta noty obciążeniowej',
      'import': 'Faktura importowa',
      'import-correction': 'Korekta importowa',
    },

    form: {
      name: 'Nazwa szablonu',
      namePlaceholder: 'Wprowadź nazwę szablonu',
      invoiceType: 'Typ faktury',
      format: 'Format numeru',
      formatHelp: 'Użyj znaczników: YYYY (rok), MM (miesiąc), NNN/NNNN (numery)',
      nextNumber: 'Następny numer',
      resetPeriod: 'Okres resetowania',
      prefix: 'Prefiks',
      suffix: 'Sufiks',
      prefixPlaceholder: 'Opcjonalny prefiks',
      suffixPlaceholder: 'Opcjonalny sufiks',
    },

    resetPeriods: {
      monthly: 'Miesięcznie',
      yearly: 'Rocznie',
      never: 'Nigdy',
    },

    formatBuilder: {
      title: 'Kreator formatu',
      palette: 'Przeciągnij elementy aby zbudować format',
      canvas: 'Wzorzec formatu',
      preview: 'Podgląd',
      elements: {
        year4: 'Rok (YYYY)',
        year2: 'Rok (YY)',
        month: 'Miesiąc (MM)',
        number3: 'Numer (NNN)',
        number4: 'Numer (NNNN)',
        text: 'Tekst niestandardowy',
      },
    },

    actions: {
      add: 'Dodaj szablon',
      edit: 'Edytuj szablon',
      delete: 'Usuń szablon',
      setDefault: 'Ustaw jako domyślny',
      clone: 'Sklonuj szablon',
      save: 'Zapisz',
      cancel: 'Anuluj',

      create: {
        success: 'Szablon utworzony pomyślnie',
        error: 'Nie udało się utworzyć szablonu',
      },
      update: {
        success: 'Szablon zaktualizowany pomyślnie',
        error: 'Nie udało się zaktualizować szablonu',
      },
      deleteTemplate: {
        confirm: 'Czy na pewno chcesz usunąć ten szablon?',
        confirmDescription: 'Tej akcji nie można cofnąć',
        success: 'Szablon usunięty pomyślnie',
        error: 'Nie udało się usunąć szablonu',
      },
      setDefaultTemplate: {
        success: 'Domyślny szablon zaktualizowany pomyślnie',
        error: 'Nie udało się ustawić domyślnego szablonu',
      },
    },

    validation: {
      nameRequired: 'Nazwa szablonu jest wymagana',
      nameMinLength: 'Nazwa szablonu musi mieć co najmniej 3 znaki',
      formatRequired: 'Format jest wymagany',
      missingNumberPlaceholder: 'Format musi zawierać co najmniej jeden znacznik numeru (NNN lub NNNN)',
      invalidPlaceholder: 'Znaleziono nieprawidłowy znacznik w formacie',
      nextNumberMin: 'Następny numer musi być większy od 0',
      nextNumberRequired: 'Następny numer jest wymagany',
      nextNumberInt: 'Następny numer musi być liczbą całkowitą',
    },

    states: {
      noTemplates: 'Nie znaleziono szablonów',
      addFirstTemplate: 'Dodaj pierwszy szablon',
      default: 'Domyślny',
      loading: 'Ładowanie szablonów...',
      error: 'Nie udało się załadować szablonów',
    },
  },
}
