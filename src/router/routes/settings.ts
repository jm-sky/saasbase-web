import { isAuthenticated } from '@/router/middleware/isAuthenticated'
import { isVerified } from '@/router/middleware/isVerified'
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
        name: 'settings-index',
        redirect: '/settings/profile',
      },
      {
        path: 'profile',
        name: 'settings-profile',
        component: () => import('@/views/settings/SettingsProfileView.vue'),
      },
      {
        path: 'account',
        name: 'settings-account',
        component: () => import('@/views/settings/SettingsAccountView.vue'),
      },
      {
        path: 'appearance',
        name: 'settings-appearance',
        component: () => import('@/views/settings/SettingsAppearanceView.vue'),
      },
      {
        path: 'notifications',
        name: 'settings-notifications',
        component: () => import('@/views/settings/SettingsNotificationsView.vue'),
      },
    ],
  }
]
