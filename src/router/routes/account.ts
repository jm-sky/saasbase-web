import { isAuthenticated } from '@/router/middleware/isAuthenticated'
import type { RouteRecordRaw } from 'vue-router'

export const accountRoutes: RouteRecordRaw[] = [
  {
    path: '/account',
    name: 'account',
    component: () => import('@/pages/account/AccountPage.vue'),
    meta: {
      middlewares: [isAuthenticated],
    },
    children: [
      {
        path: '',
        name: 'account-get-started',
        component: () => import('@/pages/account/GetStartedPage.vue'),
      },
      {
        path: 'profile',
        name: 'account-profile',
        component: () => import('@/pages/account/ProfilePage.vue'),
      },
      {
        path: 'settings',
        name: 'account-settings',
        component: () => import('@/pages/account/SettingsPage.vue'),
      },
      {
        path: 'notifications',
        name: 'account-notifications',
        component: () => import('@/pages/account/NotificationsPage.vue'),
      },
      {
        path: 'appearance',
        name: 'account-appearance',
        component: () => import('@/pages/account/AppearancePage.vue'),
      },
      {
        path: 'invite',
        name: 'account-invite',
        component: () => import('@/pages/account/InvitePage.vue'),
      },
      {
        path: 'activity',
        name: 'account-activity',
        component: () => import('@/pages/account/ActivityPage.vue'),
      },
      {
        path: 'security',
        name: 'account-security',
        component: () => import('@/pages/account/security/SecurityPage.vue'),
        children: [
          {
            path: '',
            name: 'account-security-get-started',
            component: () => import('@/pages/account/security/GetStartedPage.vue'),
          },
          {
            path: 'privacy',
            name: 'account-security-privacy',
            component: () => import('@/pages/account/security/PrivacyPage.vue'),
          },
          {
            path: 'devices',
            name: 'account-security-devices',
            component: () => import('@/pages/account/security/DevicesPage.vue'),
          },
          {
            path: 'log',
            name: 'account-security-log',
            component: () => import('@/pages/account/security/LogPage.vue'),
          },
          {
            path: 'sessions',
            name: 'account-security-sessions',
            component: () => import('@/pages/account/security/SessionsPage.vue'),
          },
        ],
      },
      {
        path: 'api-keys',
        name: 'account-api-keys',
        component: () => import('@/pages/account/ApiKeysPage.vue'),
      },
      {
        path: 'billing',
        name: 'account-billing',
        component: () => import('@/pages/account/billing/BillingPage.vue'),
        children: [
          {
            path: '',
            name: 'account-billing-basic',
            component: () => import('@/pages/account/billing/BasicPage.vue'),
          },
          {
            path: 'plans',
            name: 'account-billing-plans',
            component: () => import('@/pages/account/billing/PlansPage.vue'),
          },
          {
            path: 'history',
            name: 'account-billing-history',
            component: () => import('@/pages/account/billing/HistoryPage.vue'),
          },
        ],
      },
    ],
  },
]
