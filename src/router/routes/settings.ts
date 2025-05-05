import { isAuthenticated } from '@/router/middleware/isAuthenticated'
import { isVerified } from '@/router/middleware/isVerified'
import { routeMap } from '../routeMap'
import type { RouteRecordRaw } from 'vue-router'

export const settingsRoutes: RouteRecordRaw[] =  [
  {
    path: '/settings',
    component: () => import('@/views/settings/SettingsView.vue'),
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
        component: () => import('@/views/settings/SettingsProfileView.vue'),
      },
      {
        path: 'account',
        name: routeMap.settings.account,
        component: () => import('@/views/settings/SettingsAccountView.vue'),
      },
      {
        path: 'appearance',
        name: routeMap.settings.appearance,
        component: () => import('@/views/settings/SettingsAppearanceView.vue'),
      },
      {
        path: 'notifications',
        name: routeMap.settings.notifications,
        component: () => import('@/views/settings/SettingsNotificationsView.vue'),
      },
      {
        path: '2fa-setup',
        name: routeMap.settings.mfaSetup,
        component: () => import('@/views/settings/MfaSetupView.vue'),
      },
    ],
  }
]
