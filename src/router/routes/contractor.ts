import { isAuthenticated } from '@/router/middleware/isAuthenticated'
import { isInTenant } from '@/router/middleware/isInTenant'
import { isVerified } from '@/router/middleware/isVerified'
import type { RouteRecordRaw } from 'vue-router'

export const contractorRoutes: RouteRecordRaw[] = [
  {
    path: '/contractors',
    name: 'contractors',
    component: () => import('@/pages/contractor/ContractorListView.vue'),
    meta: {
      middlewares: [isAuthenticated, isVerified, isInTenant],
    },
  },
  {
    path: '/contractors/add',
    name: 'addContractor',
    component: () => import('@/pages/contractor/AddContractorView.vue'),
    meta: {
      middlewares: [isAuthenticated, isVerified, isInTenant],
    },
  },
]
