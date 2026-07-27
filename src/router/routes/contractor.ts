import { isAuthenticated } from '@/router/middleware/isAuthenticated'
import { isInTenant } from '@/router/middleware/isInTenant'
import { isVerified } from '@/router/middleware/isVerified'
import type { RouteRecordRaw } from 'vue-router'

export const contractorRoutes: RouteRecordRaw[] = [
  {
    path: '/contractors',
    name: 'contractors',
    component: () => import('@/pages/contractor/ContractorListPage.vue'),
    meta: {
      title: 'contractor.title',
      middlewares: [isAuthenticated, isVerified, isInTenant],
    },
  },
  {
    path: '/contractors/add',
    name: 'addContractor',
    component: () => import('@/pages/contractor/AddContractorPage.vue'),
    meta: {
      title: 'contractor.add.title',
      middlewares: [isAuthenticated, isVerified, isInTenant],
    },
  },
  {
    path: '/contractors/:id/show',
    component: () => import('@/pages/contractor/ShowContractorPage.vue'),
    meta: {
      title: 'contractor.show.title',
      middlewares: [isAuthenticated, isVerified, isInTenant],
    },
    children: [
      {
        path: '',
        name: 'showContractor',
        redirect: { name: 'showContractorOverview' },
      },
      {
        path: 'overview',
        name: 'showContractorOverview',
        component: () => import('@/pages/contractor/ShowContractorOverviewPage.vue'),
      },
      {
        path: 'comments',
        name: 'showContractorComments',
        component: () => import('@/pages/contractor/ShowContractorCommentsPage.vue'),
      },
      {
        path: 'logs',
        name: 'showContractorLogs',
        component: () => import('@/pages/contractor/ShowContractorLogsPage.vue'),
      },
      {
        path: 'preferences',
        name: 'showContractorPreferences',
        component: () => import('@/pages/contractor/ShowContractorPreferencesPage.vue'),
      },
    ],
  },
  {
    path: '/contractors/:id/edit',
    name: 'editContractor',
    component: () => import('@/pages/contractor/EditContractorPage.vue'),
    meta: {
      middlewares: [isAuthenticated, isVerified, isInTenant],
    },
  },
]
