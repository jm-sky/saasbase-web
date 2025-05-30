import type { RouteLocationRaw } from 'vue-router'

export const routeMap = {
  auth: {
    login: 'login',
    passwordForgot: 'passwordForgot',
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
}

export const routeTo = {
  login: (): RouteLocationRaw => ({ name: routeMap.auth.login }),
  passwordForgot: (): RouteLocationRaw => ({ name: routeMap.auth.passwordForgot }),
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
}
