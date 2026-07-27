# Plan: Echo/Pusher dynamic JWT

## Problem

`src/plugins/echo.ts` sets `Authorization: Bearer <token>` once at module
import from `localStorage`. After REST token refresh in
`interceptUnauthorized`, Echo keeps the old JWT → `/broadcasting/auth` 401
until full page reload. Consumers: chat widgets, notifications drawer.

## Implementation

1. Replace static header with an authorizer (or equivalent) that reads the
   **current** token from `localStorage` (`${config.appId}:token`) on every
   broadcasting auth request.
2. Export a small `syncEchoAuthToken(token: string | null)` helper that updates
   `echo.connector.options.auth.headers.Authorization` when present.
3. Call `syncEchoAuthToken` from `authStore.setToken` / `clearToken` (or a
   thin wrapper used by the store) so refresh and logout stay in sync.
4. Keep existing channel subscribe/leave call sites unchanged.

## Acceptance

- After access-token refresh (401 → refresh → retry), a new private channel
  subscribe (or re-auth) sends the new Bearer token.
- Logout clears Echo auth header (no stale Bearer).

## Out of scope

Re-subscribing all live channels on every refresh; switching broadcaster
config; fixing FloatingChatWidget bot-tenant 403.
