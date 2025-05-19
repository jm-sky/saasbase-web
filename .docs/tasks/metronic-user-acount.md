# Metronic User Account page

I want to adopt User Account pages from Metronic template.

We need:
- routes
  - parent route like `/account`
  - child routes like `/account/profile`, `account/settings`
- template for parent route
- pages in `/src/pages/account`, i.e. `AccountPage.vue`, `AccountSettingsPage.vue`
- create a service in `src/domains/account/services` folder (i.e. `accountActivity.service.ts`, `accountApiKeys.service.ts`) (check pattern in `src/domains/contractor/services/ContractorService.ts`)
- create interfaces in `domains/[domain]/types` folder
- fetching data from service should contain catch block with `handleErrorWithToast`
- we're using Vee-Validate, example here `src/pages/auth/RegisterPage.vue`
- we should place validation schemas in ``src/domains/[domain]/validation` folder. It should be Zod's TypedSchema, example here `src/domains/user/validation/profileSchema.ts`
- we can extract common comonents and place them in `src/domains/[domain]/components` folder
- recognize where we can use our shad-cn-vue components from `src/components/ui` folder
- optionaly add variants to our components, prefixed with `metronic` like `metronic-primary-outline` for a outlined button with light primary background
- we can create pinia store in `src/domains/[domain]/stores/[name].store.ts`
- we use our toast implementation using `useToast`, we don't need to add anything fancy
- we can omit testing for now

React files for account pages are located here:
- `.docs/temp/metronic-tailwind-react-v9.2.0/src/pages/account`

This is a list of pages I want to adopt in raw HTML form:
- Account \ Get Started
  - file: `.docs/temp/metronic-tailwind-html-v9.2.0/html/demo1/account/home/get-started.html`
  - url: https://keenthemes.com/metronic/tailwind/demo1/account/home/get-started

- Account \ User Profile
  - file: `.docs/temp/metronic-tailwind-html-v9.2.0/html/demo1/account/home/user-profile.html`
  - url: https://keenthemes.com/metronic/tailwind/demo1/account/home/user-profile

- Account \ Settings
  - file: `.docs/temp/metronic-tailwind-html-v9.2.0/html/demo1/account/home/settings-sidebar.html`
  - url: https://keenthemes.com/metronic/tailwind/demo1/account/home/settings-sidebar

- Notifications
  - file: `.docs/temp/metronic-tailwind-html-v9.2.0/html/demo1/account/notifications.html`
  - url: https://keenthemes.com/metronic/tailwind/demo1/account/notifications

- Appearance
  - file: `.docs/temp/metronic-tailwind-html-v9.2.0/html/demo1/account/appearance.html`
  - url: https://keenthemes.com/metronic/tailwind/demo1/account/appearance

- Invite a friend
  - file: `.docs/temp/metronic-tailwind-html-v9.2.0/html/demo1/account/invite-a-friend.html`
  - url: https://keenthemes.com/metronic/tailwind/demo1/account/invite-a-friend

- Activity
  - file: `.docs/temp/metronic-tailwind-html-v9.2.0/html/demo1/account/activity.html`
  - url: https://keenthemes.com/metronic/tailwind/demo1/account/activity

- Security \ Get started
  - file: `.docs/temp/metronic-tailwind-html-v9.2.0/html/demo1/account/security/get-started.html`
  - url: https://keenthemes.com/metronic/tailwind/demo1/account/security/get-started

- Security \ Privacy Settings
  - file: `.docs/temp/metronic-tailwind-html-v9.2.0/html/demo1/account/security/privacy-settings/index.html.html`
  - url: https://keenthemes.com/metronic/tailwind/demo1/account/security/privacy-settings/index.html

- Security \ Device management
  - file: `.docs/temp/metronic-tailwind-html-v9.2.0/html/demo1/account/security/device-management.html`
  - url: https://keenthemes.com/metronic/tailwind/demo1/account/security/device-management

- Security \ Security log
  - file: `.docs/temp/metronic-tailwind-html-v9.2.0/html/demo1/account/security/security-log.html`
  - url: https://keenthemes.com/metronic/tailwind/demo1/account/security/security-log

- API keys
  - file: `.docs/temp/metronic-tailwind-html-v9.2.0/html/demo1/account/api-keys.html`
  - url: https://keenthemes.com/metronic/tailwind/demo1/account/api-keys

- Current sessions
  - file: `.docs/temp/metronic-tailwind-html-v9.2.0/html/demo1/account/security/current-sessions.html`
  - url: https://keenthemes.com/metronic/tailwind/demo1/account/security/current-sessions

- Billing
  - file: `.docs/temp/metronic-tailwind-html-v9.2.0/html/demo1/account/billing/basic.html`
  - url: https://keenthemes.com/metronic/tailwind/demo1/account/billing/basic

- Billing \ Plans
  - file: `.docs/temp/metronic-tailwind-html-v9.2.0/html/demo1/account/billing/plans.html`
  - url: https://keenthemes.com/metronic/tailwind/demo1/account/billing/plans

- Billing \ History
  - file: `.docs/temp/metronic-tailwind-html-v9.2.0/html/demo1/account/billing/history.html`
  - url: https://keenthemes.com/metronic/tailwind/demo1/account/billing/history

- 