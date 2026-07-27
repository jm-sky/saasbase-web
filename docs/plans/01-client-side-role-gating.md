# Plan: Client-side role-gating (Owner/Admin hotspots)

## Problem

UI shows Owner/Admin actions to every member; denial only after click (403 toast).
`GET /me` returns Spatie `getRoleNames()` without team context, while policies use
`TenantScopedRoles` (pivot `tenant_id`) — frontend roles can be empty/wrong for
the current tenant.

## Scope (this iteration)

Infrastructure + hotspots matching Owner/Admin policies. Not a full UI sweep.

## Backend (`saasbase-api`)

1. Add `TenantScopedRoles::roleNamesFor(User $user, string $tenantId): array`
   and `permissionNamesFor(...)` (pivot join, same pattern as `userHasAnyRole`).
2. Update `UserResource` to return tenant-scoped `roles` / `permissions` when
   `$user->getTenantId()` is set; empty arrays when outside a tenant context.
3. Feature test: user with Owner in tenant A gets `roles: ['Owner']` on `/me`
   with tenant-scoped JWT; no Owner when role is only in another tenant.

## Frontend (`saasbase-web`)

1. `src/domains/rights/types/roleName.ts` — string union matching backend
   `RoleName` (`Owner`, `Admin`, `Manager`, …).
2. `src/domains/rights/composables/useCan.ts`:
   - `hasRole(name)`, `hasAnyRole(names[])`, `isOwnerOrAdmin` from
     `useAuthStore().user?.roles`.
3. Gate hotspots with `v-if="isOwnerOrAdmin"`:
   - Invoice delete (`DeleteInvoiceButton`, `DeleteInvoiceAction`)
   - Address / bank account delete actions (tenant + contractor where applicable)
   - Tenant invitations form (`TenantInvitationsPage` / form)
   - Tenant branding page actions
   - Tenant integrations config (save/delete)

## Acceptance

- Member without Owner/Admin: delete invoice / invite form / branding save /
  integration edit not rendered (or disabled + hidden).
- Owner/Admin: unchanged access.
- `/me` roles match pivot for current `tid`.

## Out of scope

Full permission matrix, route middleware by role, FinancialManager-only surfaces.
