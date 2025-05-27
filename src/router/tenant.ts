import type { RouteRecordRaw } from 'vue-router'

export const tenantRoutes: RouteRecordRaw[] = [
  {
    path: '/tenants/:id/show',
    name: 'tenant.show',
    component: () => import('@/pages/tenant/ShowTenantPage.vue'),
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
        name: 'tenant-billing',
        component: () => import('@/pages/tenant/ShowTenantPage/BillingPage.vue'),
        children: [
          {
            path: '',
            name: 'tenant-billing-basic',
            component: () => import('@/pages/tenant/ShowTenantPage/Billing/BasicPage.vue'),
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
