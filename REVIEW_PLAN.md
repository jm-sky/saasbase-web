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
| auth, account, tenant, user | W trakcie |
| invoice, expense, product, project, contractor | W trakcie |
| financial, identityConfirmation, subscription | **Ukończona** |
| chat, feed, task, tags, skill, comment, invitations | W trakcie |
| rights, shared, utils, infrastruktura (api client, router, i18n) | W trakcie |

## Findings

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
