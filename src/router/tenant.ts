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
        path: 'logs',
        name: 'tenant.show.logs',
        component: () => import('@/pages/tenant/ShowTenantPage/TenantLogsPage.vue'),
      },
    ],
  },
]
