export const settings = {
  // Common settings translations
  pageTitle: 'Ustawienia',
  save: 'Zapisz',
  cancel: 'Anuluj',
  delete: 'Usuń',
  confirm: 'Potwierdź',
  success: 'Sukces',
  error: 'Błąd',
  loading: 'Ładowanie...',

  profile: {
    title: 'Profil',
    description: 'Tak będą Cię widzieć inni na stronie.',
    updateProfile: 'Aktualizuj profil',
    resetForm: 'Resetuj formularz',
    public: 'Publiczny',
    user: {
      firstName: 'Imię',
      firstNameDescription: 'To jest Twoje publiczne imię.',
      lastName: 'Nazwisko',
      lastNameDescription: 'To jest Twoje publiczne nazwisko.',
      email: 'Email',
      phone: 'Telefon',
      birthDate: 'Data urodzenia',
      description: 'Opis',
      bio: 'Bio',
      location: 'Lokalizacja',
      position: 'Stanowisko',
      website: 'Strona internetowa',
      socialLinks: {
        facebook: 'Facebook',
        instagram: 'Instagram',
        twitter: 'Twitter',
        linkedin: 'LinkedIn',
        youtube: 'YouTube',
      },
      descriptionPlaceholder: 'Powiedz nam coś o sobie',
      isPublicProfile: 'Ustaw profil publiczny',
      publicFields: {
        email: 'Email publiczny',
        phone: 'Telefon publiczny',
        birthDate: 'Data urodzenia publiczna',
      },
    },
    failedToUpdate: 'Nie udało się zaktualizować profilu',
    profileImage: {
      title: 'Zdjęcie profilowe',
      description: 'Prześlij nowe zdjęcie profilowe. Wspierane formaty: JPG, PNG, GIF',
      maxSize: 'Maksymalny rozmiar pliku: 5MB',
      uploadImage: 'Prześlij zdjęcie',
      removeImage: 'Usuń zdjęcie',
      failedToUpload: 'Nie udało się przesłać zdjęcia',
      failedToRemove: 'Nie udało się usunąć zdjęcia',
      success: 'Zdjęcie profilowe zaktualizowane pomyślnie',
    }
  },

  // Account section
  account: {
    title: 'Konto',
    sessions: {
      title: 'Aktywne Sesje',
      description: 'Zarządzaj aktywnymi sesjami na różnych urządzeniach',
      currentSession: 'Bieżąca Sesja',
      device: 'Urządzenie',
      location: 'Lokalizacja',
      lastActive: 'Ostatnia Aktywność',
      terminate: 'Zakończ Sesję',
      terminateAll: 'Zakończ Wszystkie Inne Sesje',
      terminateConfirm: 'Czy na pewno chcesz zakończyć tę sesję?',
      terminateAllConfirm: 'Czy na pewno chcesz zakończyć wszystkie inne sesje?'
    },
    devices: {
      title: 'Zaufane Urządzenia',
      description: 'Zarządzaj urządzeniami, które mogą uzyskać dostęp do Twojego konta',
      deviceName: 'Nazwa Urządzenia',
      lastUsed: 'Ostatnie Użycie',
      remove: 'Usuń Urządzenie',
      removeConfirm: 'Czy na pewno chcesz usunąć to urządzenie?'
    },
    logs: {
      title: 'Historia Aktywności',
      description: 'Przeglądaj historię aktywności swojego konta',
      date: 'Data',
      action: 'Akcja',
      ip: 'Adres IP',
      noLogs: 'Brak historii aktywności'
    },
    delete: {
      title: 'Usuń Konto',
      description: 'Trwale usuń swoje konto i wszystkie powiązane dane',
      warning: 'Tej akcji nie można cofnąć. Wszystkie Twoje dane zostaną trwale usunięte.',
      confirmText: 'Wpisz "DELETE" aby potwierdzić',
      confirmPlaceholder: 'DELETE',
      success: 'Konto zostało pomyślnie usunięte'
    },
    invitations: {
      title: 'Zaproszenia do Aplikacji',
      description: 'Zarządzaj zaproszeniami do aplikacji',
      status: 'Status',
      invitedBy: 'Zaproszony przez',
      date: 'Data Zaproszenia',
      accept: 'Akceptuj',
      decline: 'Odrzuć',
      noInvitations: 'Brak oczekujących zaproszeń'
    }
  },

  // Authentication section
  authentication: {
    title: 'Uwierzytelnianie',
    apiKeys: {
      title: 'Klucze API',
      description: 'Zarządzaj kluczami API dla integracji zewnętrznych',
      create: 'Utwórz Nowy Klucz API',
      name: 'Nazwa Klucza',
      created: 'Utworzono',
      lastUsed: 'Ostatnie Użycie',
      expires: 'Wygasa',
      never: 'Nigdy',
      revoke: 'Unieważnij',
      revokeConfirm: 'Czy na pewno chcesz unieważnić ten klucz API?',
      copy: 'Kopiuj Klucz',
      copied: 'Skopiowano do schowka',
      newKey: 'Nowy Klucz API',
      keyWarning: 'Pamiętaj, aby skopiować swój klucz API teraz. Nie będziesz mógł go zobaczyć ponownie!'
    },
    mfa: {
      title: 'Uwierzytelnianie Dwuskładnikowe',
      description: 'Dodaj dodatkową warstwę bezpieczeństwa do swojego konta',
      enable: 'Włącz 2FA',
      disable: 'Wyłącz 2FA',
      setup: 'Konfiguracja 2FA',
      verify: 'Weryfikuj Kod',
      recoveryCodes: 'Kody Odzyskiwania',
      downloadCodes: 'Pobierz Kody Odzyskiwania',
      codesWarning: 'Przechowuj te kody odzyskiwania w bezpiecznym miejscu. Możesz ich użyć do uzyskania dostępu do konta, jeśli stracisz urządzenie 2FA.',
      qrCode: 'Zeskanuj Kod QR',
      manualCode: 'Kod do Ręcznego Wprowadzenia',
      enterCode: 'Wprowadź 6-cyfrowy kod z aplikacji uwierzytelniającej'
    }
  },

  // Preferences section
  preferences: {
    title: 'Preferencje',
    appearance: {
      title: 'Wygląd',
      description: 'Dostosuj wygląd aplikacji',
      theme: 'Motyw',
      language: 'Język',
      timezone: 'Strefa Czasowa',
      dateFormat: 'Format Daty',
      timeFormat: 'Format Czasu',
      system: 'Systemowy',
      light: 'Jasny',
      dark: 'Ciemny'
    },
    notifications: {
      title: 'Powiadomienia',
      description: 'Zarządzaj preferencjami powiadomień',
      email: 'Powiadomienia Email',
      push: 'Powiadomienia Push',
      inApp: 'Powiadomienia w Aplikacji',
      categories: {
        security: 'Bezpieczeństwo',
        updates: 'Aktualizacje',
        marketing: 'Marketing',
        system: 'System'
      },
      frequency: {
        immediate: 'Natychmiast',
        daily: 'Dzienny Digest',
        weekly: 'Tygodniowy Digest',
        never: 'Nigdy'
      }
    }
  }
}
