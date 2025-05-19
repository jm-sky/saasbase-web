# Refactor invitation system

- Create a `useInvitationStore`:
  - Store `invitationToken` in `sessionStorage` (useSessionStorage from vue-use) 
  - Also store the full `invitation` object
  - Load the invitation data in the `useInvitation()` composable if `invitationToken` is present in query (previously as `invitation` query param) (we already have most of the logic there) 

- In the login page:
  - Read `invitationToken` from route query param (not just `token`, rename if needed)
  - Set `invitationToken` in the invitation store
  - We already have most of the logic there using composable 

- Create an `InvitationInfo.vue` component:
  - Show message: "You've been invited by **{user}** to **{tenant}** as **{role}**" (choose nice form) 
  - Use this component on the login and register pages
  - Display it conditionally based on the invitation store state

- Create a dedicated page to accept or decline the invitation:
  - Redirect to this page after login/register if a valid invitation token is present in the store (redirect with `next` query param if needed) 
  - New page should implement our useNextPage composable to redirect user after accept/decline to previously requested page 

- Create `RoleLookup` component using shadcn-vue components, something like select2. It should have search field, and list of options. It should use roleService to load available roles. Those should be placed in `src/domains/rights/components|services` folders. Check existing patterns.
- Use this component on InvitationsTab page when creating invitation to select role. 


- Backend:
  - Implement a decline invitation endpoint (e.g., `POST /invitations/{id}/decline`)
  - In the frontend, call this endpoint from the invitation page when the user declines 