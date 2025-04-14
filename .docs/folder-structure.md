```
src/
├── assets/                # Statyczne zasoby (np. obrazy, czcionki)
│   ├── images/
│   └── fonts/
├── components/            # Komponenty Vue
│   ├── Base/              # Komponenty bazowe (np. przyciski, formularze)
│   └── Layout/            # Komponenty layoutów (np. header, sidebar)
├── composables/           # Hooki i funkcje wspólne (np. używane w setup())
│   ├── useAuth.ts         # Autoryzacja
│   ├── useApi.ts          # Komunikacja z API
│   └── useValidation.ts   # Walidacja
├── domains/               # Moduły aplikacji (np. użytkownicy, projekty)
│   ├── user/              # Moduł użytkowników
│   │   ├── components/    # Komponenty specyficzne dla tego modułu
│   │   │   ├── UserCard.vue
│   │   │   ├── UserList.vue
│   │   ├── services/      # Serwisy i API związane z użytkownikami
│   │   ├── store/         # Pinia store dla użytkowników
│   │   ├── types.ts       # Typy i interfejsy związane z użytkownikami
│   │   └── validation/    # Walidacja związana z użytkownikami
│   │       └── userValidation.ts
│   ├── project/           # Moduł projektów
│   │   ├── components/    # Komponenty specyficzne dla projektów
│   │   │   ├── ProjectCard.vue
│   │   │   ├── ProjectList.vue
│   │   ├── services/      # Serwisy i API związane z projektami
│   │   ├── store/         # Pinia store dla projektów
│   │   ├── types.ts       # Typy i interfejsy związane z projektami
│   │   └── validation/    # Walidacja związana z projektami
│   │       └── projectValidation.ts
│   ├── contractor/        # Moduł kontrahentów
│   │   ├── components/    # Komponenty specyficzne dla kontrahentów
│   │   │   ├── ContractorCard.vue
│   │   ├── services/      # Serwisy i API związane z kontrahentami
│   │   ├── store/         # Pinia store dla kontrahentów
│   │   ├── types.ts       # Typy i interfejsy związane z kontrahentami
│   │   └── validation/    # Walidacja związana z kontrahentami
│   │       └── contractorValidation.ts
│   └── ...                # Inne moduły (np. faktury, zadania)
├── i18n/                  # Tłumaczenia aplikacji
│   ├── en.json
│   └── pl.json
├── layouts/               # Układy stron
│   ├── DefaultLayout.vue  # Domyślny układ aplikacji (np. header, sidebar)
│   └── AdminLayout.vue    # Układ dla panelu administracyjnego
├── pages/                 # Strony aplikacji
│   ├── User/              # Strony związane z użytkownikami
│   │   ├── UserListPage.vue
│   │   ├── UserProfilePage.vue
│   │   └── UserSettingsPage.vue
│   ├── Project/           # Strony związane z projektami
│   │   ├── ProjectListPage.vue
│   │   ├── ProjectDetailPage.vue
│   │   └── ProjectCreatePage.vue
│   ├── Contractor/        # Strony związane z kontrahentami
│   │   ├── ContractorListPage.vue
│   │   ├── ContractorDetailPage.vue
│   │   └── ContractorCreatePage.vue
│   └── ...                # Inne strony (np. faktury, zadania)
├── router/                # Konfiguracja routera
│   ├── index.ts           # Główna konfiguracja tras
│   ├── routes.ts          # Definicje tras aplikacji
│   └── middlewares/       # Middleware'y do autoryzacji, uprawnień itp.
│       ├── isAdmin.ts     # Middleware sprawdzający, czy użytkownik jest administratorem
│       └── isAuthenticated.ts  # Middleware sprawdzający, czy użytkownik jest zalogowany
├── store/                 # Globalny Pinia store
│   └── index.ts           # Główna konfiguracja stanu
├── styles/                # Globalne style
│   ├── tailwind.config.js # Konfiguracja TailwindCSS
│   └── global.scss        # Globalne style (jeśli używasz SCSS)
├── utils/                 # Narzędzia, pomocnicze funkcje
│   └── dateUtils.ts       # Przykład: funkcje do formatowania dat
├── App.vue                # Główny komponent aplikacji
└── main.ts                # Główny plik wejściowy
```