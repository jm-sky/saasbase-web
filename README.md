# SaaSBass Web

Frontend aplikacji SaaS (multi-tenant) dla systemu **SaaSBass**, stworzonego z użyciem **Vue 3**, **TypeScript**, **Pinia**, **TailwindCSS** oraz **Vite**. Aplikacja współpracuje z API backenda: [saasbase-api](https://github.com/jm-sky/saasbase-api).

![obraz](https://github.com/jm-sky/vue-ts-boilerplate/assets/17783569/c02801a0-894e-4395-93b0-6f7bcae4913d)

## Technologie

- **Vue 3** + **TypeScript**
- **Vite** – szybki bundler i dev server
- **Pinia** – zarządzanie stanem
- **Vue Router** – routing
- **TailwindCSS** – stylowanie
- **Axios** – komunikacja z API
- **i18n** – wielojęzyczność
- **Eslint + Prettier** – linting i formatowanie
- **Vitest + Vue Test Utils** – testy jednostkowe

## Struktura projektu

```
.
├── public/                # Statyczne pliki publiczne
├── src/
│   ├── assets/           # Zasoby (grafiki, style)
│   ├── components/       # Wspólne komponenty UI (niezależne od domeny)
│   ├── composables/      # Reużywalne funkcje (composition API)
│   ├── domains/          # Foldery domenowe (np. projects, tasks, invoices)
│   │   └── każda domena: komponenty, stores, api, typy, itd.
│   │       ├── components
│   │       ├── factories
│   │       ├── mocks
│   │       ├── models
│   │       ├── services
│   │       ├── types
│   │       └── validation
│   ├── layouts/          # Układy aplikacji (np. default, auth)
│   ├── pages/            # Widoki routingu (np. `/login`, `/dashboard`)
│   ├── router/           # Konfiguracja tras
│   ├── services/         # Globalne serwisy (np. auth, axios, api)
│   ├── stores/           # Globalne stany Pinia
│   ├── types/            # Typy globalne TypeScript
│   ├── utils/            # Pomocnicze funkcje
│   └── main.ts           # Punkt wejścia aplikacji
```

### Konwencja domen

Każda funkcjonalność aplikacji (np. Projekty, Zadania, Faktury) ma swój folder w `src/domains/<domena>` i zawiera:

- `components/` – komponenty związane z daną domeną  
- `pages/` – widoki domenowe  
- `stores/` – Pinia store’y domenowe  
- `api.ts` – funkcje do komunikacji z backendem  
- `types.ts` – lokalne typy i interfejsy  

Dzięki temu struktura jest skalowalna i łatwa w utrzymaniu.

## Uruchomienie projektu

### Wymagania

- Node.js `>=18`
- pnpm `>=8` (lub npm/yarn)

### Instalacja

```bash
pnpm install
```

### Środowisko

Stwórz plik `.env` na podstawie `.env.example`:

```bash
cp .env.example .env
```

Ustaw adres backendu (API):

```
VITE_API_URL=http://localhost:8000/api
```

### Start aplikacji developerskiej

```bash
pnpm dev
```

### Budowanie produkcyjne

```bash
pnpm build
```

### Preview wersji produkcyjnej

```bash
pnpm preview
```

## Styl kodu

Kod jest automatycznie formatowany przy użyciu Prettier i sprawdzany przez ESLint.

```bash
pnpm lint
pnpm format
```

## Testy

Testy pisane są z użyciem **Vitest**.

```bash
pnpm test
```

## Współpraca z backendem

Ten frontend jest zaprojektowany do współpracy z:

**[saasbase-api (Laravel)](https://github.com/jm-sky/saasbase-api)**

Backend udostępnia pełne REST API oraz wspiera multi-tenancy, autoryzację przez JWT, oraz wszystkie funkcje wymienione powyżej.

## Funkcjonalności

- rejestracja i logowanie (email, Google, GitHub)
- obsługa JWT + odświeżanie tokenów
- 2FA (opcjonalnie)
- zarządzanie użytkownikami, projektami, zadaniami
- system komentarzy, tagów, załączników
- obsługa wielu języków (i18n)
- ciemny/jasny motyw (dynamiczny)
- dynamiczne ustawienia per tenant

## TODO / Roadmap

- Integracja z modułem faktur (preview PDF, upload, pobieranie)
- Wsparcie dla drag & drop zadań (Kanban)
- System powiadomień toast/websocket
- Preferencje użytkownika (język, motyw, powiadomienia)
- Testy e2e (np. Playwright)

## Licencja

Projekt rozwijany prywatnie.
