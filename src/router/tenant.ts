import type { RouteRecordRaw } from 'vue-router'

export const tenantRoutes: RouteRecordRaw[] = [
  {
    path: '/tenants',
    name: 'tenants',
    component: () => import('@/pages/tenant/TenantsPage.vue'),
  },
  {
    path: '/tenants/:id/show',
    name: 'tenant.show',
    component: () => import('@/pages/tenant/ShowTenantPage.vue'),
    children: [
      {
        path: 'overview',
        name: 'tenant.show.overview',
        component: () => import('@/pages/tenant/ShowTenantPage/OverviewTab.vue'),
      },
      {
        path: 'logs',
        name: 'tenant.show.logs',
        component: () => import('@/pages/tenant/ShowTenantPage/LogsTab.vue'),
      },
      {
        path: 'invitations',
        name: 'tenant.show.invitations',
        component: () => import('@/pages/tenant/ShowTenantPage/InvitationsTab.vue'),
      },
    ],
  },
]
