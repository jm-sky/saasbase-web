import type { TIdentityConfirmationType } from '@/domains/identityConfirmation/types/identityConfirmation.type'
import type { RouteLocationRaw } from 'vue-router'

export const routeMap = {
  landing: 'landing',
  auth: {
    login: 'login',
    passwordForgot: 'passwordForgot',
    resetPassword: 'resetPassword',
    register: 'register',
    verifyEmail: 'verifyEmail',
    mfaVerify: 'mfaVerify',
    selectTenant: 'selectTenant',
  },
  invitation: {
    accept: 'invitationAccept',
  },
  account: {
    index: 'account',
    getStarted: 'account-get-started',
  },
  settings: {
    index: 'settings-index',
    profile: 'settings-profile',
    account: 'settings-account',
    appearance: 'settings-appearance',
    notifications: 'settings-notifications',
    mfaSetup: 'mfaSetup',
  },
  userProfile: 'userProfile',
  userPublicProfile: 'userPublicProfile',
  identityConfirmation: {
    index: 'identityConfirmation',
  },
  tenant: {
    financialSettings: {
      numberingTemplates: 'tenant.financial.numbering-templates',
      invoiceTemplates: 'tenant.financial.invoice-templates',
      invoiceTemplatesCreate: 'tenant.financial.invoice-templates-create',
      invoiceTemplatesEdit: 'tenant.financial.invoice-templates-edit',
    },
    userSettings: {
      organizationUnits: 'tenant.user.organization-units',
      organizationUnit: 'tenant.user.organization-unit',
      invitations: 'tenant.user.invitations',
    },
  },
}

export const routeTo = {
  landing: (): RouteLocationRaw => ({ name: routeMap.landing }),
  login: (): RouteLocationRaw => ({ name: routeMap.auth.login }),
  passwordForgot: (): RouteLocationRaw => ({ name: routeMap.auth.passwordForgot }),
  resetPassword: (): RouteLocationRaw => ({ name: routeMap.auth.resetPassword }),
  register: (): RouteLocationRaw => ({ name: routeMap.auth.register }),
  selectTenant: (): RouteLocationRaw => ({ name: routeMap.auth.selectTenant }),
  userProfile: (): RouteLocationRaw => ({ name: routeMap.userProfile }),
  invitationAccept: (): RouteLocationRaw => ({ name: routeMap.invitation.accept }),
  account: (): RouteLocationRaw => ({ name: routeMap.account.index }),
  accountGetStarted: (): RouteLocationRaw => ({ name: routeMap.account.getStarted }),
  settingsIndex: (): RouteLocationRaw => ({ name: routeMap.settings.index }),
  settingsProfile: (): RouteLocationRaw => ({ name: routeMap.settings.profile }),
  settingsAccount: (): RouteLocationRaw => ({ name: routeMap.settings.account }),
  settingsAppearance: (): RouteLocationRaw => ({ name: routeMap.settings.appearance }),
  settingsNotifications: (): RouteLocationRaw => ({ name: routeMap.settings.notifications }),
  userPublicProfile: (id: string): RouteLocationRaw => ({ name: routeMap.userPublicProfile, params: { id } }),
  identityConfirmation: (type?: TIdentityConfirmationType): RouteLocationRaw => ({ name: routeMap.identityConfirmation.index, params: { type } }),
  tenants: (): RouteLocationRaw => ({ name: routeMap.auth.selectTenant }),
}
