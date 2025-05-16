import { isAuthenticated } from '@/router/middleware/isAuthenticated'
import { isInTenant } from '@/router/middleware/isInTenant'
import { isVerified } from '@/router/middleware/isVerified'
import type { RouteRecordRaw } from 'vue-router'

export const tenantRoutes: RouteRecordRaw[] = [
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
        name: 'showTenantOverview',
        component: () => import('@/pages/tenant/ShowTenantOverviewPage.vue'),
      },
      {
        path: 'logs',
        name: 'showTenantLogs',
        component: () => import('@/pages/tenant/ShowTenantLogsPage.vue'),
      },
    ],
  },
]