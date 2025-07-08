import { isAuthenticated } from '@/router/middleware/isAuthenticated'
import { isInTenant } from '@/router/middleware/isInTenant'
import { isVerified } from '@/router/middleware/isVerified'
import type { RouteRecordRaw } from 'vue-router'

export const expenseRoutes: RouteRecordRaw[] = [
  {
    path: '/expenses',
    name: 'expenses',
    component: () => import('@/pages/expense/ExpenseListPage.vue'),
    meta: {
      middlewares: [isAuthenticated, isVerified, isInTenant],
    },
  },
  {
    path: '/expenses/add',
    name: 'addExpense',
    component: () => import('@/pages/expense/AddExpensePage.vue'),
    meta: {
      middlewares: [isAuthenticated, isVerified, isInTenant],
    },
  },
  {
    path: '/expenses/:id/show',
    name: 'showExpense',
    component: () => import('@/pages/expense/ShowExpensePage.vue'),
    meta: {
      middlewares: [isAuthenticated, isVerified, isInTenant],
    },
  },
  {
    path: '/expenses/:id/edit',
    name: 'editExpense',
    component: () => import('@/pages/expense/EditExpensePage.vue'),
    meta: {
      middlewares: [isAuthenticated, isVerified, isInTenant],
    },
  },
]
