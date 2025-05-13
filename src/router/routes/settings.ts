import { isAuthenticated } from '@/router/middleware/isAuthenticated'
import { isVerified } from '@/router/middleware/isVerified'
import { routeMap } from '../routeMap'
import type { RouteRecordRaw } from 'vue-router'

export const settingsRoutes: RouteRecordRaw[] =  [
  {
    path: '/settings',
    component: () => import('@/pages/settings/SettingsView.vue'),
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
        component: () => import('@/pages/settings/SettingsProfileView.vue'),
      },
      {
        path: 'account',
        name: routeMap.settings.account,
        component: () => import('@/pages/settings/SettingsAccountView.vue'),
      },
      {
        path: 'appearance',
        name: routeMap.settings.appearance,
        component: () => import('@/pages/settings/SettingsAppearanceView.vue'),
      },
      {
        path: 'notifications',
        name: routeMap.settings.notifications,
        component: () => import('@/pages/settings/SettingsNotificationsView.vue'),
      },
      {
        path: '2fa-setup',
        name: routeMap.settings.mfaSetup,
        component: () => import('@/pages/settings/MfaSetupView.vue'),
      },
    ],
  }
]
