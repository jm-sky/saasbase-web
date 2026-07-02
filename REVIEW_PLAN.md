# Frontend Review Plan (Faza 4)

Kontynuacja przeglądu z `saasbase-api/REVIEW_PLAN.md` — Faza 4 sprawdza, czy frontend
(saasbase-web) poprawnie odzwierciedla kontrakt API backendu, w tym zmiany wprowadzone
w Fazach 0-3 tego samego przeglądu (nowa autoryzacja RBAC, walidacja faktur, Stripe
tokenization, Export whitelist, itd.).

Metodologia: 5 równoległych agentów, każdy pokrywa grupę domen z checklisty w
`saasbase-api/REVIEW_PLAN.md` (sekcja "Faza 4"). Wyniki dopisywane per grupa, w osobnych
commitach.

## Status wykonania

| Grupa domen | Status |
|---|---|
| auth, account, tenant, user | **Ukończona** |
| invoice, expense, product, project, contractor | **Ukończona** |
| financial, identityConfirmation, subscription | **Ukończona** |
| chat, feed, task, tags, skill, comment, invitations | **Ukończona** |
| rights, shared, utils, infrastruktura (api client, router, i18n) | **Ukończona** |

## Findings

### rights, shared, utils, infrastruktura (api client, router, stores, i18n)

**Wzorzec:** centralny klient Axios obsługuje tylko 401 i jeden konkretny wariant 403 (`select-tenant`) — każdy inny 403 (w tym nowo wyegzekwowane uprawnienia z backendu i `verify-2fa`) przepływa dalej i zależy wyłącznie od tego, czy dany komponent ręcznie owinął wywołanie w `handleErrorWithToast` (robi to 115 plików, ale nic tego nie wymusza centralnie). System 2FA jest w praktyce całkowicie zepsuty end-to-end — trzy niezależne, kumulujące się bugi.

**Obsługa błędów / 403 (najważniejsze ustalenie całej fazy):**

- **[CRITICAL]** `src/lib/api/index.ts` ma tylko dwa interceptory: `interceptUnauthorized` (401) i `interceptTenantRequired` (403 + `actionRequired === 'select-tenant'`). **Nie istnieje żaden ogólny handler dla zwykłego 403** — leci dalej przez łańcuch promisów. Domyślnym wzorcem jest opcjonalne `handleErrorWithToast()` (115 miejsc używa), więc większość ekranów pokaże jakiś toast — ale to nie jest wymuszone centralnie, nie rozróżnia 403 "brak uprawnień" od 422/500 (zawsze ten sam czerwony toast), a fallback przy braku `data.message` to zahardkodowany `'Unknown error'` (nie i18n). **Wniosek dla reszty audytu Fazy 4: nowe 403 z backendu w większości NIE spowodują crashy, tylko generyczny toast — ale zawsze po angielsku (patrz niżej) i bez rozróżnienia "brak uprawnień".**

**2FA/MFA — całkowicie zepsute end-to-end (potwierdza i pogłębia finding z grupy auth/account/tenant/user):**

- **[CRITICAL]** Middleware `is2faRequested` nie jest podpięty do ŻADNEJ trasy (potwierdzone grepem po `src/router/routes/*.ts`) — użytkownik z 2FA loguje się i ląduje prosto na dashboardzie zamiast na `/2fa-verify`.
- **[CRITICAL]** Backend zwraca `403 { actionRequired: 'verify-2fa' }` przy blokadzie — `interceptTenantRequired.ts` sprawdza wyłącznie `'select-tenant'`, string `'verify-2fa'` nie występuje nigdzie indziej w kodzie. Każde żądanie API takiego usera kończy się nieobsłużonym 403.
- **[CRITICAL]** Nawet gdyby user ręcznie trafił na `/2fa-verify` i podał poprawny kod: backend zwraca NOWY token z `mfa=2`, ale `2faVerifyPage.vue` po `verify2fa()` od razu robi `router.push({ name: 'dashboard' })` **bez zapisania nowego tokena przez `authStore.setToken()`**. Stary token z `mfa=1` zostaje w localStorage — user jest efektywnie trwale zablokowany w aplikacji, nie ma żadnej ścieżki wyjścia.

**Accept-Language / i18n komunikatów backendowych:**

- **[HIGH]** Nagłówek `Accept-Language` ustawiony RAZ, statycznie na `DEFAULT_LOCALE` przy tworzeniu instancji Axios — nigdy nie aktualizowany gdy user przełącza język. Backend wybiera lokalizację wyłącznie na podstawie tego nagłówka. **Wszystkie komunikaty generowane przez backend (błędy walidacji, komunikaty odmowy uprawnień z polityk) będą zawsze po angielsku**, niezależnie od języka UI — szczególnie dotkliwe teraz, gdy dużo więcej endpointów zwraca opisowe 403.

**Brak client-side role/permission gatingu (potwierdza findingi z innych grup):**

- **[HIGH]** W całym `src/` nie ma żadnego `useCan`/`usePermissions`/`hasRole`/`hasPermission`, ani statycznego odpowiednika backendowego enuma `RoleName`. Systemowy brak, nie luka pojedynczej domeny — potwierdza identyczne findingi z grup auth/tenant i invoice/product/contractor.

**JWT / tenant / refresh — plumbing (głównie pozytywne):**

- **[POZYTYWNE]** Nie znaleziono realnego bugu "stale tenant context" po przełączeniu tenanta — `TenantService.switch` poprawnie zapisuje nowy token, każde żądanie czyta aktualny token z localStorage.
- **[MEDIUM]** `interceptUnauthorized.ts` — refresh tokena używa gołego `axios` zamiast skonfigurowanej instancji `api` (brak `baseURL`/`withCredentials`). Dziś "działa" bo `VITE_API_URL` jest relatywny (ten sam origin), ale cichy fail przy przyszłym absolutnym cross-origin URL.
- **[MEDIUM]** `interceptTenantRequired.ts` czyta `error.response.data.actionRequired` bez opcjonalnego chainingu na `data` — rzuci wyjątkiem wewnątrz interceptora jeśli backend kiedyś zwróci 403 z pustym/nie-JSON body.

**Domena rights:**

- **[MEDIUM]** `RolePicker.vue`/`PositionCategoryPicker.vue` ustawiają lokalny `error` ref przy nieudanym pobraniu listy, ale nigdy go nie renderują w template — user zobaczy po prostu pusty/martwy picker bez wyjaśnienia. Istotne teraz, gdy `GET /roles` może dostać nowo wyegzekwowany 403.

**Ogólna jakość:**

- **[LOW]** `apiRoutesMap` używane tylko w 35 z 75 plików serwisowych — reszta hardkoduje literały ścieżek. Centralizacja istnieje, ale nieegzekwowana.
- **[LOW]** `'Access-Control-Allow-Origin': '*'` ustawiony jako nagłówek żądania (nie ma sensu — to nagłówek odpowiedzi CORS) — relikt kopiuj-wklej.
- **[LOW]** Drift i18n: `en/tenant.ts` brakuje bloku `addresses.delete.*`, obecnego w `pl/tenant.ts` (dziś nieużywany w kodzie, więc nieszkodliwy).

### invoice, expense, product, project, contractor

**Wzorzec:** to najbogatsza w findingi grupa tej fazy. Cały dropdown akcji faktury (poza PDF i delete) to atrapy UI (`TODO` + `setTimeout` + fałszywy toast sukcesu) — "share link" i "zmień status" nic nie robią mimo naprawionego backendu. Do tego realny bug shadowingu zmiennej kasujący całą listę faktur po usunięciu jednej, formularz tworzenia projektu strukturalnie niekompletny (brak wymaganego `statusId`), i systemowy brak jakiejkolwiek kontroli roli (Owner/Admin) w UI całej tej grupy domen — przyciski usuwania/eksportu/zarządzania adresami zawsze widoczne, awaria dopiero po kliknięciu.

**Invoice:**

- **[CRITICAL]** `ChangeStatusAction.vue`/`SharePublicLinkAction.vue` (i praktycznie cały dropdown akcji faktury: `CopyInvoiceAction`, `ManagePaymentAction`, `ExportBankTransferAction`, `ManageRemindersAction`, `ManageRelationshipsAction`, `RecurringInvoiceAction`, `SendToKsefAction`, `SendEmailAction`) to atrapy — `TODO: Implement service integration`, `setTimeout`, `console.log`, kończą się fałszywym `toast.success(...)` bez żadnego wywołania API. `SharePublicLinkAction` nawet nie kopiuje niczego do schowka mimo komunikatu "Public link copied". Efekt: mimo że `InvoiceShareTokenController::store()` naprawiono w Fazie 3, funkcja "udostępnij link" nadal nic nie robi na froncie — nigdy nie wywoływała serwisu. Dodatkowo lista statusów w `ChangeStatusAction.vue` (`draft/sent/paid/overdue/cancelled`) nie odpowiada realnemu enumowi backendu (`draft/processing/issued/completed/cancelled`) — nawet po podłączeniu API zostałyby odrzucone przez `new Enum(InvoiceStatus::class)`.
- **[CRITICAL]** Blokada pól finansowych na fakturach COMPLETED/CANCELLED (naprawiona w Fazie 2) nie działa w praktyce dla PATCH z powodu niezgodności camelCase/snake_case: frontend wysyła `totalNet`/`totalTax`/`totalGross`/`exchangeRate` (camelCase), a `UpdateInvoiceRequest::FINANCIAL_FIELDS`/`validateFinancialSum()` na backendzie sprawdzają `$this->has('total_net')` itd. (snake_case) — zawsze `false` dla realnych requestów z frontu. **Backendowa "siatka bezpieczeństwa" jest dziurawa przy update**: da się nadpisać sumy finansowe na ukończonej fakturze, a walidacja `total_net+total_tax=total_gross` nigdy się nie uruchamia przy edycji (działa poprawnie tylko przy CREATE, gdzie klucze są camelCase). Front też nie ma własnej blokady UI — pola zawsze edytowalne niezależnie od statusu. **To wymaga fixu po stronie backendu** (już zgłoszone do REVIEW_PLAN.md saasbase-api jako known-issue do doprecyzowania), plus warto dodać blokadę UI na froncie niezależnie.
- **[HIGH]** Bug shadowingu zmiennej w `DeleteInvoiceAction.vue`: `invoiceStore.invoices = invoicesStore.value.filter((invoice) => invoice.id !== invoice.id)` — parametr callbacku przesłania zewnętrzny `invoice`, porównanie zawsze `false`, `filter` zawsze zwraca pustą tablicę. **Usunięcie JEDNEJ faktury czyści całą listę w store.** Równoległy, poprawny komponent `DeleteInvoiceButton.vue` filtruje poprawnie po `props.id` — dwie implementacje tej samej funkcji, jedna zepsuta.
- **[MEDIUM]** Błąd unikalności numeru faktury (nowa walidacja z Fazy 2) wyświetla się tylko w ogólnym banerze na dole długiego formularza, nie przy polu `number` (które nie ma własnego `FormFieldLabeled`) — myląca UX.
- **[MEDIUM]** Twarde dane demo jako wartości domyślne formularza tworzenia faktury: `number: 'TEST/0001'`, `name: 'DEMO BUYER'`, `address: 'Random street 123'` — realny user może przypadkiem wysłać fakturę z tymi wartościami, walidacja Zod to przepuści.
- **[LOW]** Niezlokalizowane placeholdery w liniach faktury (`Description`/`Quantity`/`Price` bez `t()`).

**Expense:**

- **[LOW]** Kopiuj-wklej bug: eksport wydatków pobiera plik jako `invoices.xlsx` zamiast `expenses.xlsx`.
- **[INFO]** Brak UI alokacji/zatwierdzania wydatków w ogóle — backendowy 403-dla-wszystkich (znany known-issue) nigdy nie jest odpytywany z frontu, bo nie ma odpowiednich komponentów.

**Product/Contractor — brak kontroli roli (potwierdza finding z grupy auth/tenant):**

- **[HIGH]** Zero kontroli roli Owner/Admin w UI całej tej grupy domen (invoice/expense/product/contractor/project) — przyciski usuwania i eksportu kontrahentów/produktów/faktur/wydatków oraz zarządzania adresami/kontami bankowymi kontrahenta zawsze widoczne i klikalne dla każdego membera. Globalny interceptor Axios obsługuje tylko 401, nie 403 — każdy komponent ma lokalny `catch` → toast, więc user dostaje komunikat (nie cichy fail), ale UX jest zły: przycisk nie powinien się w ogóle pojawiać dla kogoś bez uprawnień. Systemowy brak — potwierdzone grepem zero wystąpień `isOwner`/`isAdmin`/`hasRole`/`can()` w całym repo.
- **[INFO]** Whitelist kolumn eksportu (Faza 3) nieistotna dla frontu — nie ma column-pickera, wszystkie `export()` wysyłają tylko filtry, bez `columns[]`.
- **[LOW]** Zduplikowana deklaracja interfejsu `IProductLookup` w tym samym pliku (TS scala przez declaration merging, ale to mylący dead code).

**Project:**

- **[CRITICAL]** Formularz tworzenia projektu nie wysyła wymaganego pola `statusId` (`AddProjectPage.vue` buduje initialValues tylko z `name`/`description`) — backend wymaga `statusId` jako `required`, a UI nie ma w ogóle pickera statusu. **Funkcja jest strukturalnie zepsuta niezależnie od znanego backendowego crasha 500** — nawet po naprawie backendu formularz zawsze skończy się 422. Duży, wyeksponowany przycisk "+" na liście projektów prowadzi do w pełni niedziałającej funkcji. `IProjectCreate` (TS type) też jest niepoprawny dla create (wymusza pola typu `owner`/`users`/`requiredSkills`, których realny `CreateProjectRequest` nie przyjmuje).
- **[LOW]** Błędna przestrzeń nazw i18n w `ProjectSidebar.vue` — używa kluczy `t('product.fields.*')` zamiast `t('project.fields.*')` (kopiuj-wklej z ProductSidebar).
- **[MEDIUM]** Brak UI tworzenia/edycji tasków — ogranicza ekspozycję znanego braku `TaskPolicy` (403 na view/update/delete) do samego wyświetlania listy.

### chat, feed, task, tags, skill, comment, invitations

**Wzorzec:** dobra wiadomość — większość nowych restrykcji backendu (Skill/SkillCategory auth, DM cross-tenant check, tag delete route) nic nie psuje na froncie, bo odpowiadające akcje po prostu nie mają UI (są martwym kodem serwisowym). Realne problemy leżą gdzie indziej: zamrożony token JWT w kliencie WebSocket (Echo), hardkodowany bot w widżecie czatu bez obsługi błędu, brak jakiegokolwiek client-side gate'owania roli w formularzu zaproszeń, oraz polskie placeholdery demo pozostawione w produkcyjnych formularzach (feed/comment).

- **[HIGH]** `src/plugins/echo.ts` — token JWT do autoryzacji prywatnych kanałów Pusher/Echo jest odczytany z `localStorage` **raz, przy imporcie modułu** (Echo tworzone przy starcie aplikacji). Zwykłe requesty REST czytają token dynamicznie przy każdym wywołaniu i mają pełny refresh-flow (`interceptUnauthorized.ts`). Po odświeżeniu tokenu (np. po 401) Echo dalej autoryzuje `/broadcasting/auth` starym tokenem — subskrypcje kanałów czatu zaczną dostawać 401 aż do przeładowania strony. Niezależne od zmian backendu w tej sesji, ale krytyczne dla stabilności czatu w dłuższych sesjach.
- **[HIGH]** `FloatingChatWidget.vue` tworzy pokój DM z hardkodowanym botem (`config.chat.botId`). Po nowej regule backendu (`DirectMessageController::createRoom` wymaga wspólnego tenanta) — jeśli bot nie jest formalnie przypisany do danego tenanta (pivot `tenants`), `createRoom()` dostanie 403. `onOpened()` nie ma `try/catch` — cały widżet po prostu przestanie działać bez żadnego komunikatu. Wymaga weryfikacji, czy bot faktycznie ma wpis w `tenants` pivot dla każdego tenanta.
- **[MEDIUM]** `ChatFullPageComponent.vue::createRoom()` nie ma `try/catch` (w przeciwieństwie do sąsiednich wywołań w tym samym pliku) — błąd 403 (np. race condition z userem usuniętym z tenanta) wpadnie jako nieobsłużony unhandled rejection.
- **[MEDIUM]** `TenantInvitationForm.vue` (formularz zapraszania z wyborem roli) renderowany bezwarunkowo, trasa ma tylko `isAuthenticated, isVerified, isInTenant` — brak sprawdzenia roli Owner/Admin. Po nowym wymogu backendu zwykły user dostaje w pełni aktywny formularz i 403 dopiero po kliknięciu "Wyślij" (obsłużone przez toast, więc nie jest to cichy fail, ale zły UX). Pozytyw: lista ról w pickerze pobierana dynamicznie z `GET /roles`, nie hardkodowana — brak ryzyka niezgodności z `RoleName::cases()`.
- **[MEDIUM]** `CreateFeedForm.vue` i `CommentForm.vue` inicjalizują pola formularza polskim tekstem demo (`'Mój pierwszy post'` / `'To jest mój pierwszy post'`) zamiast pustym polem — realnie używane w produkcji (comment form w projektach/produktach/kontrahentach). Brak walidacji Zod na obu formularzach (`useForm` bez `validationSchema`), brak obsługi błędów 422 w `catch`.
- **[POZYTYWNE]** Skill/SkillCategory: `skillService.ts` ma metody `create/update/delete`, ale żaden komponent ich nie wywołuje — nie ma UI do zarządzania skillami/kategoriami, więc nowy wymóg roli Owner/Admin na backendzie nic nie psuje. Podobnie DM-picker w `ChatFullPageComponent.vue` pobiera userów z `GET /users`, który już zwraca tylko userów bieżącego tenanta — nowa restrykcja cross-tenant w `createRoom` nigdy nie zostanie naruszona normalnym przepływem UI. Podobnie cała domena `task` jest UI-wise wyłącznie do odczytu (create/update/delete nieużywane).
- **[LOW]** `TagService.delete`/`useTags.ts::deleteTag` wołają `DELETE /tags/{tag}`, ale backendowa trasa jest zarejestrowana tylko z `only(['index','store'])` — nie ma route'u destroy dla globalnych tagów. Na szczęście nigdy nie wywoływane z UI (prawdziwe usuwanie tagów idzie przez inny, per-model serwis) — martwy kod do usunięcia.
- **[LOW]** i18n: hardkodowane angielskie stringi w `useTags.ts` i `ShowProjectTasksPage.vue` zamiast `t()`.
- **[LOW]** Dead code: `aiChatService.ts` ma zakomentowany zduplikowany kod; `comment.schema.ts` cały plik nieużywany (`CommentForm.vue` nie ma `validationSchema`), a jego enum `commentableType` ma `Task` (brak UI) i brakuje mu `Product` (ma UI) — dowód że plik nie jest utrzymywany.
- **Uwaga strukturalna:** właściwy przepływ "zaproszenie do tenanta z rolą" żyje w `src/domains/tenant/*/invitations/`, NIE w `src/domains/invitations/` (to ostatnie to osobne "Application Invitations" bez ról, niezwiązane z RoleName/Owner-Admin).

### auth, account, tenant, user

**Wzorzec:** przepływ logowania i 2FA jest rozjechany — kod obsługujący wymuszenie 2FA istnieje, ale jest martwy i niepodłączony; callback OAuth ignoruje stan błędu, który backend teraz faktycznie wysyła; UI nigdzie nie warunkuje akcji administracyjnych rolą użytkownika mimo świeżo dodanego RBAC na backendzie.

- **[CRITICAL]** Wymuszenie 2FA po stronie frontu jest martwym kodem — backendowy `mfa` middleware zablokuje niemal całą aplikację użytkownikom z 2FA. `src/router/middleware/is2faRequested.ts` nigdy nie jest importowany/używany, ma też przestarzałą sygnaturę niezgodną z pozostałymi middleware. `LoginPage.vue`/`UserAuthModal.vue` przekierowują na dashboard od razu po loginie, bez sprawdzenia czy 2FA zostało zweryfikowane. `src/lib/api/interceptTenantRequired.ts` obsługuje tylko `actionRequired === 'select-tenant'` — nowy `EnsureTwoFactorVerified` (backend) zwraca 403 z `actionRequired: 'verify-2fa'`, na co nigdzie w kodzie frontu nie ma obsługi. **Efekt: user z włączonym 2FA loguje się, ląduje na dashboardzie, po czym każde kolejne wywołanie API (praktycznie cała aplikacja poza auth/invitations/images) zwraca 403 bez żadnej sensownej obsługi.** Strona `/2fa-verify` istnieje i działa poprawnie, ale nic tam nie przekierowuje.
- **[HIGH]** Strona callbacku OAuth (`OAuth2CallbackPage.vue`) nie odczytuje parametru `error` z przekierowania odrzucenia konta — backend (`OAuthController::callback`) przy istniejącym mailu pod innym providerem przekierowuje z `?error=account_exists`, ale frontend czyta tylko `jwtToken`. Zmienna `error` i `<Alert v-if="error">` to martwy kod — user zawsze widzi ogólny toast zamiast informacji, że mail jest już zarejestrowany. Brak i18n na tej stronie.
- **[HIGH]** Brak jakiegokolwiek warunkowania UI rolą (Owner/Admin) mimo nowego RBAC na backendzie. Potwierdzone grepem: w domenach tenant/auth/account/user nie ma żadnego helpera `isOwner`/`isAdmin`/`hasRole`/`can()`. Przyciski edycji/usuwania w org units, addresses, bank accounts, invitations, branding są zawsze widoczne dla każdego membera — o odmowie dowiaduje się dopiero po kliknięciu, przez generyczny, nietłumaczony toast. Pozytyw: `RolePicker`/`roleService` pobierają role dynamicznie z `GET /roles`, więc nie ma ryzyka zahardkodowanej/nieaktualnej listy ról przy wysyłce zaproszeń.
- **[MEDIUM]** `UserProfilePage.vue` nie obsługuje błędu przy pobieraniu profilu (brak `catch`) — backend teraz odrzuca (403) jeśli viewer i target nie dzielą tenanta. Ryzyko ograniczone w praktyce (wszystkie linki do `/users/:id` w kodzie pochodzą z zasobów już przypisanych do bieżącego tenanta), ale trasa nie ma middleware `isInTenant`.
- **[MEDIUM]** Typ `IUserProfileLegacy` nie ma pola `birthDate`, które backend (`UserProfileTenantScopedResource`) teraz zwraca.
- **[MEDIUM]** Typy dla `/user/preferences` (nowo zarejestrowany endpoint) istnieją 1:1 z backendowym kontraktem (`UserPreference`/`UpdatePreferenceRequest`), ale nie są nigdzie użyte — endpoint nigdy nie jest wołany z frontendu. Zamiast tego istnieją dwie równoległe, częściowo pokrywające się ścieżki (`/user/settings` i `/user/profile`) — niejasne, czy `/user/preferences` ma je zastąpić, czy to zaplanowana ale nierozpoczęta funkcja.
- **[LOW]** i18n: `TenantBrandingPage.vue` przekazuje surowy klucz i18n do `handleErrorWithToast` zamiast wywołać `t(...)` — user widzi dosłowny klucz zamiast tłumaczenia. `SettingsAccountPage.vue` ma całą sekcję email/phone/2FA/password zahardkodowaną po angielsku (formularz email/phone jest przy tym martwy — przycisk disabled, submit tylko loguje do konsoli).
- **[LOW]** Literówka w kontrakcie: `ITenant.prefereces` zamiast `preferences` (pre-existing, nie z tej sesji).
- **[LOW]** `AccountService.ts` to w większości mock/placeholder (`// TODO: Replace with actual API call`) dla billing history/devices/sessions, równoległy do realnego, działającego `UserSessions.service.ts` — dwa mechanizmy dla tej samej funkcji, jeden fałszywy, niepodłączony do `SettingsDevicesPage.vue`.

**Priorytety napraw:** (1) podłączyć wymuszenie 2FA — bez tego funkcja jest realnie zepsuta, (2) obsłużyć `route.query.error` w OAuth callbacku, (3) dodać warunkowanie UI rolą lub co najmniej ujednolicić/przetłumaczyć obsługę 403, (4) `catch` w UserProfilePage + uzupełnić typ.

### financial, identityConfirmation, subscription

**Wzorzec:** `subscription` łączy dwa niezależne, niespójne ze sobą przepływy płatności — jeden (aktywny, używany w UI) jest już PCI-poprawny (Stripe Checkout redirect), drugi (martwy kod: `SubscriptionService.buy()`) to niesprzątnięty relikt starej, właśnie naprawionej po stronie backendu architektury z surowymi danymi karty. `financial` i `identityConfirmation` to głównie komponenty prezentacyjne/formularze z lukami w i18n i nieużywanym/zaśmieconym kodem.

**Stripe / płatności (temat priorytetowy — dobra wiadomość):**

- **[INFO]** Rzeczywisty, aktywny formularz zakupu subskrypcji (`BuySubscriptionPlanModal.vue`) jest poprawny PCI-wise — używa `@stripe/stripe-js` (`loadStripe`) i przekierowuje na Stripe-hosted Checkout (`stripe.redirectToCheckout({ sessionId })`) po utworzeniu sesji przez `POST /subscription/checkout`. Żadne dane karty nigdy nie trafiają do frontendu ani backendu (SAQ A). Backend sam wyznacza `billingCustomer` po stronie serwera — problem "stary billingCustomerId po przełączeniu tenanta" nie dotyczy tego przepływu.
- **[HIGH]** Martwy kod odtwarzający dokładnie wzorzec PCI, który backend właśnie naprawił. `SubscriptionService.ts` (`buy()`, `POST /subscriptions`) i `subscription.type.ts` (`PaymentDetails { cardNumber, expiry, cvc, name }`) wciąż deklarują stare, surowe pola karty — backend dziś wymaga wyłącznie `paymentDetails.paymentMethodId` (`pm_...`) + `billingCustomerId`. `buy()` nie jest wywoływane z żadnego komponentu (potwierdzone grepem) — nie ma dziś aktywnego zepsutego formularza, ale to pułapka na przyszłość. Rekomendacja: usunąć `buy()`/`PaymentDetails`/`StoreSubscriptionRequest` z frontendu albo przepisać zgodnie z nowym kontraktem.
- **[MEDIUM]** Panel z testową kartą Stripe (`4242 4242 4242 4242`) renderowany bezwarunkowo w `BuySubscriptionPlanModal.vue`, bez `import.meta.env.DEV`/feature flagu — ryzyko ujawnienia danych testowych na produkcji. Tekst też całkowicie po angielsku, bez `t()`.
- **[MEDIUM]** `config.ts` ma fallback fałszywego `VITE_STRIPE_PUBLISHABLE_KEY` (`pk_test_5100...`) gdy zmienna środowiskowa brakuje — maskuje błędną konfigurację niejasnym błędem Stripe zamiast czytelnego komunikatu.
- **[LOW]** `StripeMessages.vue` to martwy, nieużywany nigdzie komponent. Obsługa błędów checkoutu w `BuySubscriptionPlanModal.vue` pokazuje surowy `err.response?.data.message` z axiosa, nie przez `t()`.

**Kontrakt typów (subscription):**

- **[MEDIUM]** `ISubscriptionPlan` ma pola (`billingInterval`, `stripePriceId`) których backend nie zwraca na tym poziomie (są tylko zagnieżdżone w `prices[]`). Niegroźne dziś (nieużywane), ale mylące.
- **[LOW]** `IFeature` ma pola (`createdAt`/`updatedAt`) niezwracane przez `PlanFeatureResource`, i brakuje mu `isUnlimited`/`isLimited`, które backend faktycznie zwraca.
- **[LOW]** `ISubscriptionPlan` brakuje `isActive`, mimo że backend je zwraca i serwis filtruje po nim.

**i18n:**

- **[HIGH]** Polskie stringi zaszyte na sztywno w pliku locale EN (`en/subscription.ts`: `plans.title: 'Plany'` itd.) — anglojęzyczny użytkownik widzi polski tekst.
- **[MEDIUM]** Fallbacki `t()` w `ConfirmIdentityByTrustedProfileModal.vue` po polsku mimo że klucz EN istnieje — fałszywe zabezpieczenie, złamie się przy usunięciu klucza.
- **[LOW]** Hardkodowane nieprzetłumaczone stringi: `"Country"` w `PaymentInfoDisplay.vue`, placeholdery inputów w `PartySideForContractorCard.vue`/`PartySideForTenantCard.vue`, fallback `'N/A'` w `SignatureInfoSectionItem.vue`.

**Dead code:**

- **[LOW]** `PartySideForContractorCard.vue`/`PartySideForTenantCard.vue` nieużywane nigdzie w repo, i dodatkowo niedziałające gdyby ktoś je podłączył (`:model-value` bez `@update:model-value`).

**Walidacja formularzy:**

- **[LOW]** Żadna z trzech domen (financial, identityConfirmation, subscription) nie ma katalogu `validation/` z Zod — odstępstwo od konwencji z CLAUDE.md. `useForm()` wołane bez `validationSchema`.

**Poza zakresem tej grupy (przekazane do domeny `tenant`):** UI konfiguracji `TenantIntegration` (allowlist SSRF, autoryzacja Owner/Admin w `store()`) — `src/domains/tenant/components/TenantIntegrationConfigList.vue` i pokrewne.
