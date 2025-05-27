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
        component: () => import('@/pages/settings/SettingsProfilePage.vue'),
      },
      {
        path: 'account',
        name: routeMap.settings.account,
        component: () => import('@/pages/settings/SettingsAccountPage.vue'),
      },
      {
        path: 'appearance',
        name: routeMap.settings.appearance,
        component: () => import('@/pages/settings/SettingsAppearancePage.vue'),
      },
      {
        path: 'notifications',
        name: routeMap.settings.notifications,
        component: () => import('@/pages/settings/SettingsNotificationsPage.vue'),
      },
      {
        path: '2fa-setup',
        name: routeMap.settings.mfaSetup,
        component: () => import('@/pages/settings/MfaSetupPage.vue'),
      },
      {
        path: 'api-keys',
        name: 'api-keys',
        component: () => import('@/pages/settings/SettingsApiKeysPage.vue'),
      },
      {
        path: 'delete-account',
        name: 'delete-account',
        component: () => import('@/pages/settings/SettingsDeleteAccountPage.vue'),
      },
    ],
  }
]
