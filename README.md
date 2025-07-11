# SaaSBase Web

Frontend aplikacji SaaS (multi-tenant) dla systemu **SaaSBasse**, stworzonego z użyciem **Vue 3**, **TypeScript**, **Pinia**, **TailwindCSS** oraz **Vite**. Aplikacja współpracuje z API backenda: [saasbase-api](https://github.com/jm-sky/saasbase-api).

![sign-in](https://github.com/jm-sky/vue-ts-boilerplate/assets/17783569/c02801a0-894e-4395-93b0-6f7bcae4913d)

## 📦 Features

### 1. Authentication

- [x] 1.1 User registration  
- [x] 1.2 Login (email & password)  
- [x] 1.3 Password reset  
- [x] 1.4 OAuth login (Google, GitHub)  
- [x] 1.5 User-to-user invitations *(outside tenant scope)*

---

### 2. Tenant Management

- [x] 2.1 Tenant registration  
- [x] 2.2 Tenant addresses  
- [x] 2.3 Tenant bank accounts  
- [x] 2.4 Tenant organization: roles, positions, permissions  
- [x] 2.5 Internal tenant invitations  
- [ ] 2.6 Tenant public profile ⏳  
- [ ] 2.7 Tenant branding ⏳  
- [x] 2.8 Configurable third-party integrations (per-tenant credentials):  
  - [x] 2.8.1 Azure Document Intelligence  
  - [ ] 2.8.2 KSeF (Polish national e-invoicing system) ⏳  
  - [ ] 2.8.3 E-Delivery integration (Polish eDO Post) 🧪  
  - [ ] 2.8.4 Email account integration
  - [ ] 2.8.5 Google Calendar integration

---

### 3. Integrations

- [x] 3.1 REGON – Polish national business registry (official ID system for all economic entities)  
- [x] 3.2 VIES – EU-wide VAT registry for validating VAT numbers across member states  
- [x] 3.3 Ministry of Finance – Polish VAT white list registry  
- [x] 3.4 IBAN API – validates IBANs and enriches them with bank name, country, institution type  
- [x] 3.5 Azure Document Intelligence (OCR for invoices and documents)  
- [x] 3.6 Stripe – online payments & invoicing  

---

### 4. Contractors

- [x] 4.1 Full-text search & list view  
- [x] 4.2 Contractor addresses  
- [x] 4.3 Contractor bank accounts  
- [x] 4.4 Contact persons (global contacts in progress ⏳)
- [x] 4.5 Contractor logo/image  
- [x] 4.6 Registry confirmations (REGON, VIES, MF)  
- [x] 4.7 Tags
- [x] 4.8 Comments
- [x] 4.9 Export to Excel  
- [x] 4.10 Attachments  
- [x] 4.11 Activity log  

---

### 5. Shared Features (Common)

- [x] 5.1 Unified pagination, filtering, sorting  
- [ ] 5.2 Universal "Link with..." (polymorphic `Linkable` model)
- [ ] 5.3 Universal reminders (`Reminder`, polymorphic)
- [x] 5.4 Notifications system (including WebSocket support)  

---

### 6. Invoices & Expenses

- [x] 6.1 List & search invoices
- [x] 6.2 Attachments  
- [x] 6.3 Tags  
- [ ] 6.4 Export to Excel
- [ ] 6.5 Invoice actions:  
  - [ ] 6.3.1 Status changes
  - [ ] 6.3.2 Clone / copy
  - [ ] 6.3.3 Send by email
  - [ ] 6.3.4 Send to KSeF
  - [x] 6.3.5 Generate PDF / duplicate (custom templates)  
  - [ ] 6.3.6 Generate / attach payment
  - [ ] 6.3.7 Reminders
  - [ ] 6.3.8 Link to project, user, contractor
  - [ ] 6.3.9 Recurring invoices / templates
  - [ ] 6.3.10 Public shareable link
  - [ ] 6.3.11 Export to Elixir/Videotel batch transfers
  - [ ] 6.3.12 Bulk actions
- [ ] 6.6 Controlling dimensions (cost allocation)
- [ ] 6.7 Approval workflows with routing (backend-ready)

---

### 7. Products

- [x] 7.1 Product list & search
- [x] 7.2 Tagging
- [x] 7.3 Comments
- [x] 7.4 Product image/logo
- [x] 7.5 Attachments
- [x] 7.6 Activity log

---

### 8. Global Contacts *(in progress)*

- [ ] 8.1 Global contact management
- [ ] 8.2 Contractor linkage
- [ ] 8.3 Integration with address & contact systems
- [ ] 8.4 Search & pagination

---

### 9. Communication & Chat

- [ ] 9.1 Internal messaging/chat
- [x] 9.2 AI Chat (OpenRouter API)  

---

### 10. Projects

- [ ] 10.1 Projects (CRUD)
- [ ] 10.2 Project tasks
- [ ] 10.3 Timesheet tracking

---

### 11. Subscription

- [x] 11.1 Plans: Free, Basic, Pro, Enterprise  
- [ ] 11.2 Plan management in UI
- [x] 11.3 Stripe billing  
- [ ] 11.4 Auto-renewal
- [ ] 11.5 Account lockout after expiration

---

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
