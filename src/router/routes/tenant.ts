import { isAuthenticated } from '@/router/middleware/isAuthenticated'
import { isInTenant } from '@/router/middleware/isInTenant'
import { isVerified } from '@/router/middleware/isVerified'
import type { RouteRecordRaw } from 'vue-router'

export const tenantRoutes: RouteRecordRaw[] = [
  {
    path: '/tenants/create',
    name: 'createTenant',
    component: () => import('@/pages/tenant/CreateTenantPage.vue'),
    meta: {
      middlewares: [isAuthenticated, isVerified],
    },
  },
  {
    path: '/tenants',
    name: 'tenants',
    component: () => import('@/pages/tenant/SelectTenantPage.vue'),
    meta: {
      middlewares: [isAuthenticated, isVerified],
    },
  },
  {
    path: '/tenants/:id/show',
    name: 'showTenant',
    component: () => import('@/pages/tenant/ShowTenantPage.vue'),
    meta: {
      middlewares: [isAuthenticated, isVerified, isInTenant],
    },
    children: [
      {
        path: 'overview',
        name: 'tenant.show.overview',
        component: () => import('@/pages/tenant/ShowTenantPage/TenantOverviewPage.vue'),
      },
      {
        path: 'invitations',
        name: 'tenant.show.invitations',
        component: () => import('@/pages/tenant/ShowTenantPage/TenantInvitationsPage.vue'),
      },
      {
        path: 'branding',
        name: 'tenant.show.branding',
        component: () => import('@/pages/tenant/ShowTenantPage/TenantBrandingPage.vue'),
      },
      {
        path: 'integrations',
        name: 'tenant.show.integrations',
        component: () => import('@/pages/tenant/ShowTenantPage/TenantIntegrationsPage.vue'),
      },
      {
        path: 'public-profile',
        name: 'tenant.show.public-profile',
        component: () => import('@/pages/tenant/ShowTenantPage/TenantPublicProfilePage.vue'),
      },
      {
        path: 'settings',
        name: 'tenant.show.settings',
        component: () => import('@/pages/tenant/ShowTenantPage/TenantSettingsPage.vue'),
      },
      {
        path: 'logs',
        name: 'tenant.show.logs',
        component: () => import('@/pages/tenant/ShowTenantPage/TenantLogsPage.vue'),
      },
      {
        path: 'billing',
        component: () => import('@/pages/tenant/ShowTenantPage/BillingPage.vue'),
        children: [
          {
            path: '',
            redirect: { name: 'tenant-billing-overview' },
            name: 'tenant-billing',
          },
          {
            path: 'overview',
            name: 'tenant-billing-overview',
            component: () => import('@/pages/tenant/ShowTenantPage/Billing/OverviewPage.vue'),
          },
          {
            path: 'plans',
            name: 'tenant-billing-plans',
            component: () => import('@/pages/tenant/ShowTenantPage/Billing/PlansPage.vue'),
          },
          {
            path: 'history',
            name: 'tenant-billing-history',
            component: () => import('@/pages/tenant/ShowTenantPage/Billing/HistoryPage.vue'),
          },
        ],
      },
    ],
  },
]
