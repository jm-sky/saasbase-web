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


------
## Implementation plan

1. Create invitation store and composables:
   - Create `src/stores/invitation.ts` for `useInvitationStore`
   - Create `src/composables/useInvitation.ts` for invitation logic
   - Implement session storage integration using vue-use

2. Update login page:
   - Modify `src/pages/auth/login.vue` to handle invitation token
   - Update route handling to use new invitation token param
   - Integrate with invitation store

3. Create InvitationInfo component:
   - Create `src/components/invitation/InvitationInfo.vue`
   - Implement message display with user, tenant, and role info
   - Add styling using shadcn-vue components
   - Integrate with invitation store

4. Create invitation acceptance page:
   - Create `src/pages/invitation/accept.vue`
   - Implement accept/decline functionality
   - Add useNextPage integration
   - Handle redirects after actions

5. Create RoleLookup component:
   - Create `src/domains/rights/components/RoleLookup.vue`
   - Implement search functionality
   - Create `src/domains/rights/services/roleService.ts`
   - Integrate with shadcn-vue components

6. Update TenantInvitationsPage:
   - Modify `src/pages/tenant/ShowTenantPage/TenantInvitationsPage.vue`
   - Integrate RoleLookup component
   - Update invitation creation flow

7. Backend changes:
   - ALREADY DONE
   - Add decline invitation endpoint
   - Update invitation service
   - Add necessary database migrations if needed

8. Testing:
   - SKIP FOR NOW
   - Add unit tests for new components
   - Add integration tests for invitation flow
   - Test edge cases and error handling

9. Documentation:
   - SKIP FOR NOW
   - Update API documentation
   - Add component documentation
   - Update user guides if needed

