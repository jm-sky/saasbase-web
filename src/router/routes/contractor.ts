import { isAuthenticated } from '@/router/middleware/isAuthenticated'
import type { RouteRecordRaw } from 'vue-router'

export const contractorRoutes: RouteRecordRaw[] = [
  {
    path: '/contractors',
    name: 'contractors',
    component: () => import('@/views/contractor/ContractorListView.vue'),
    meta: {
      middlewares: [isAuthenticated],
    },
  },
  {
    path: '/contractors/add',
    name: 'addContractor',
    component: () => import('@/views/contractor/AddContractorView.vue'),
    meta: {
      middlewares: [isAuthenticated],
    },
  },
]