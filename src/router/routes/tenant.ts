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
    path: '/tenants/:id',
    name: 'tenant-show',
    component: () => import('@/pages/tenant/ShowTenantPage.vue'),
    meta: {
      middlewares: [isAuthenticated, isVerified, isInTenant],
    },
  },
  {
    path: '/tenants/:id/overview',
    name: 'tenant-overview',
    component: () => import('@/pages/tenant/ShowTenantOverviewPage.vue'),
    meta: {
      middlewares: [isAuthenticated, isVerified, isInTenant],
    },
  },
  {
    path: '/tenants/:id/logs',
    name: 'tenant-logs',
    component: () => import('@/pages/tenant/ShowTenantLogsPage.vue'),
    meta: {
      middlewares: [isAuthenticated, isVerified, isInTenant],
    },
  },
]