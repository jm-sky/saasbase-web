export const tenant = {
  title: 'Zespoły',
  tenantDetails: 'Szczegóły zespołu',
  fields: {
    country: 'Kraj',
    name: 'Nazwa',
    slug: 'Slug',
    vatId: 'NIP',
    regon: 'REGON',
    taxId: 'Identyfikator podatkowy',
    email: 'Email',
    phone: 'Telefon',
    website: 'Strona internetowa',
    visible: 'Widoczny',
    publicName: 'Nazwa publiczna',
    industry: 'Branża',
    locationCity: 'Miasto',
    locationCountry: 'Kraj',
    description: 'Opis',
    publicLogo: 'Logo publiczne',
    bannerImage: 'Obraz banera',
    socialLinks: 'Linki społecznościowe',
    address: 'Adres',
    createdAt: 'Data utworzenia',
    updatedAt: 'Data aktualizacji',
    deletedAt: 'Data usunięcia',
  },
  create: {
    title: 'Utwórz zespół',
    companyInfo: 'Informacje o firmie',
    otherDetails: 'Inne szczegóły',
    address: 'Adres',
    bankAccount: 'Konto bankowe',
    success: 'Zespół utworzony pomyślnie',
    error: 'Nie udało się utworzyć zespołu',
  },
  welcome: {
    title: 'Witaj w zespole',
    description: 'Proszę wybrać plan, aby rozpocząć',
  },
  add: {
    title: 'Dodaj zespół',
    description: 'Dodaj nowy zespół do systemu.',
  },
  delete: {
    success: 'Zespół usunięty pomyślnie',
    error: 'Nie udało się usunąć zespołu',
    confirm: 'Czy na pewno chcesz usunąć ten zespół?',
  },
  addresses: {
    add: {
      title: 'Dodaj adres',
      description: 'Dodaj nowy adres do zespołu.',
    },
    edit: {
      title: 'Edytuj adres',
      description: 'Edytuj istniejący adres zespołu.',
    },
    delete: {
      success: 'Adres usunięty pomyślnie',
      error: 'Nie udało się usunąć adresu',
      confirm: 'Czy na pewno chcesz usunąć ten adres?',
    },
  },
  invitations: {
    title: 'Zaproszenia',
    process: {
      title: 'Zaproszenie',
      info: 'Zostałeś zaproszony do dołączenia do {tenant} jako {role}.',
      description: 'Możesz zaakceptować lub odrzucić zaproszenie.',
      loading: 'Ładowanie zaproszenia...',
      invalidEmail: 'Nieprawidłowy adres email',
      load: {
        error: 'Nie udało się załadować zaproszenia',
      },
    },
    accept: {
      button: 'Zaakceptuj',
      success: 'Zaproszenie zaakceptowane',
      successDescription: 'Zostałeś dodany do {tenant}.',
      error: 'Nie udało się zaakceptować zaproszenia',
    },
    decline: {
      button: 'Odrzuć',
      success: 'Zaproszenie odrzucone',
      successDescription: 'Zostałeś usunięty z {tenant}.',
      error: 'Nie udało się odrzucić zaproszenia',
    },
    status: {
      pending: 'Oczekuje',
      accepted: 'Zaakceptowane',
      rejected: 'Odrzucone',
    },
    send: {
      title: 'Wyślij zaproszenie',
      description: 'Wyślij zaproszenie do zespołu.',
      email: 'Email',
      role: 'Rola',
      send: 'Wyślij',
      cancel: 'Anuluj',
      success: 'Zaproszenie wysłane pomyślnie',
      error: 'Nie udało się wysłać zaproszenia',
      confirm: 'Czy na pewno chcesz wysłać zaproszenie?',
      submit: 'Wyślij zaproszenie',
    },
    list: {
      title: 'Zaproszenia',
      description: 'Lista zaproszeń do zespołu.',
      email: 'Email',
      role: 'Rola',
      invitedBy: 'Zaproszony przez',
      status: 'Status',
      expires: 'Wygasa',
      acceptedAt: 'Data akceptacji',
      expiresAt: 'Data wygaśnięcia',
      createdAt: 'Data utworzenia',
      updatedAt: 'Data aktualizacji',
      deletedAt: 'Data usunięcia',
      empty: 'Brak zaproszeń',
      loading: 'Ładowanie zaproszeń...',
      error: 'Nie udało się załadować zaproszeń',
    },
    delete: {
      success: 'Zaproszenie usunięte pomyślnie',
      error: 'Nie udało się usunąć zaproszenia',
      confirm: 'Czy na pewno chcesz usunąć to zaproszenie?',
    },
  },
  overview: {
    title: 'Przegląd',
    description: 'Przegląd zespołu',
  },
  logs: {
    title: 'Logi',
  },
  branding: {
    title: 'Branding',
    fields: {
      colorPrimary: 'Kolor podstawowy',
      colorSecondary: 'Kolor dodatkowy',
      shortName: 'Krótka nazwa',
      theme: 'Motyw',
      pdfAccentColor: 'Kolor akcentu PDF',
      emailSignatureHtml: 'Podpis email',
      logo: 'Logo',
      favicon: 'Favicon',
      customFont: 'Niestandardowa czcionka',
      pdfLogo: 'Logo PDF',
      emailHeaderImage: 'Obraz nagłówka email'
    }
  },
  integrations: {
    title: 'Integracje',
  },
  billing: {
    title: 'Rozliczenia',
    overview: {
      title: 'Przegląd',
      currentPlan: {
        title: 'Aktualny plan',
        noPlan: 'Brak aktywnego planu',
        selectPlan: 'Wybierz plan, aby rozpocząć',
        changePlan: 'Zmień plan'
      },
      usage: {
        title: 'Wykorzystanie',
        storage: 'Przestrzeń',
        users: 'Użytkownicy',
        apiCalls: 'Wywołania API'
      },
      paymentMethod: {
        title: 'Metoda płatności',
        update: 'Aktualizuj'
      }
    },
    plans: {
      title: 'Plany',
      description: 'Dostępne plany do wyboru',
      monthly: 'Miesięcznie',
      yearly: 'Rocznie',
      save: 'Oszczędź 20%',
      mostPopular: 'Najpopularniejszy',
      currentPlan: 'Aktualny plan',
      selectPlan: 'Wybierz plan',
      perMonth: 'na miesiąc',
      perYear: 'na rok'
    },
    history: {
      title: 'Historia',
      date: 'Data',
      description: 'Opis',
      amount: 'Kwota',
      status: 'Status',
      invoice: 'Faktura',
      download: 'Pobierz',
      noHistory: 'Brak historii rozliczeń',
      noHistoryDescription: 'Twoja historia rozliczeń pojawi się tutaj po dokonaniu pierwszej płatności.',
      statuses: {
        paid: 'Opłacone',
        pending: 'Oczekujące',
        failed: 'Nieudane'
      }
    }
  },
  settings: {
    title: 'Ustawienia',
    fields: {
      currency: 'Waluta',
      require2fa: 'Wymagaj 2FA od użytkowników',
      contractors: {
        fetchLogo: 'Próbuj pobrać logo dla nowych kontrahentów'
      }
    },
    save: 'Zapisz'
  },
  publicProfile: {
    title: 'Profil publiczny',
    fields: {
      country: 'Kraj',
      name: 'Nazwa',
      slug: 'Slug',
      vatId: 'NIP',
      regon: 'REGON',
      taxId: 'Identyfikator podatkowy',
      email: 'Email',
      phone: 'Telefon',
      website: 'Strona internetowa',
      visible: 'Widoczny',
      publicName: 'Nazwa publiczna',
      industry: 'Branża',
      locationCity: 'Miasto',
      locationCountry: 'Kraj',
      description: 'Opis',
      publicLogo: 'Logo publiczne',
      bannerImage: 'Obraz banera',
      socialLinks: 'Linki społecznościowe',
      address: 'Adres',
      createdAt: 'Data utworzenia',
      updatedAt: 'Data aktualizji',
      deletedAt: 'Data usunięcia',
    },
    save: 'Zapisz',
    show: {
      error: 'Nie udało się załadować profilu publicznego'
    }
  },
}
