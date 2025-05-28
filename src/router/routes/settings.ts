import { isAuthenticated } from '@/router/middleware/isAuthenticated'
import { isVerified } from '@/router/middleware/isVerified'
import { routeMap } from '../routeMap'
import type { RouteRecordRaw } from 'vue-router'

export const settingsRoutes: RouteRecordRaw[] =  [
  {
    path: '/settings',
    component: () => import('@/pages/settings/SettingsPage.vue'),
    meta: {
      middlewares: [isAuthenticated, isVerified],
    },
    children: [
      {
        path: '',
        name: routeMap.settings.index,
        redirect: '/settings/profile',
      },
      {
        path: 'profile',
        name: routeMap.settings.profile,
        component: () => import('@/pages/settings/Basic/SettingsProfilePage.vue'),
      },
      {
        path: 'account',
        name: routeMap.settings.account,
        component: () => import('@/pages/settings/Basic/SettingsAccountPage.vue'),
      },
      {
        path: 'appearance',
        name: routeMap.settings.appearance,
        component: () => import('@/pages/settings/Preferences/SettingsAppearancePage.vue'),
      },
      {
        path: 'notifications',
        name: routeMap.settings.notifications,
        component: () => import('@/pages/settings/Preferences/SettingsNotificationsPage.vue'),
      },
      {
        path: '2fa-setup',
        name: routeMap.settings.mfaSetup,
        component: () => import('@/pages/settings/Authentication/MfaSetupPage.vue'),
      },
      {
        path: 'api-keys',
        name: 'api-keys',
        component: () => import('@/pages/settings/Authentication/SettingsApiKeysPage.vue'),
      },
      // Account
      {
        path: 'logs',
        name: 'logs',
        component: () => import('@/pages/settings/Account/SettingsLogsPage.vue'),
      },
      {
        path: 'invitations',
        name: 'invitations',
        component: () => import('@/pages/settings/Account/ApplicationInvitationsPage.vue'),
      },
      {
        path: 'sessions',
        name: 'sessions',
        component: () => import('@/pages/settings/Account/SettingsSessionsPage.vue'),
      },
      {
        path: 'devices',
        name: 'devices',
        component: () => import('@/pages/settings/Account/SettingsDevicesPage.vue'),
      },
      {
        path: 'delete-account',
        name: 'delete-account',
        component: () => import('@/pages/settings/Account/SettingsDeleteAccountPage.vue'),
      },
    ],
  }
]
