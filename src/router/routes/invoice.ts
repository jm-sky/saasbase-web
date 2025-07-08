import { isAuthenticated } from '@/router/middleware/isAuthenticated'
import { isInTenant } from '@/router/middleware/isInTenant'
import { isVerified } from '@/router/middleware/isVerified'
import type { RouteRecordRaw } from 'vue-router'

export const invoiceRoutes: RouteRecordRaw[] = [
  {
    path: '/invoices',
    name: 'invoices',
    component: () => import('@/pages/invoice/InvoiceListPage.vue'),
    meta: {
      middlewares: [isAuthenticated, isVerified, isInTenant],
    },
  },
  {
    path: '/invoices/add',
    name: 'addInvoice',
    component: () => import('@/pages/invoice/AddInvoicePage.vue'),
    meta: {
      middlewares: [isAuthenticated, isVerified, isInTenant],
    },
  },
  {
    path: '/invoices/:id/show',
    name: 'showInvoice',
    component: () => import('@/pages/invoice/ShowInvoicePage.vue'),
    meta: {
      middlewares: [isAuthenticated, isVerified, isInTenant],
    },
  },
  {
    path: '/invoices/:id/edit',
    name: 'editInvoice',
    component: () => import('@/pages/invoice/EditInvoicePage.vue'),
    meta: {
      middlewares: [isAuthenticated, isVerified, isInTenant],
    },
  },
]
