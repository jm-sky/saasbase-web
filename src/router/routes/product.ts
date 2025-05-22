import { isAuthenticated } from '@/router/middleware/isAuthenticated'
import { isInTenant } from '@/router/middleware/isInTenant'
import { isVerified } from '@/router/middleware/isVerified'
import type { RouteRecordRaw } from 'vue-router'

export const productRoutes: RouteRecordRaw[] = [
  {
    path: '/products',
    name: 'products',
    component: () => import('@/pages/product/ProductListPage.vue'),
    meta: {
      middlewares: [isAuthenticated, isVerified, isInTenant],
    },
  },
  {
    path: '/products/add',
    name: 'addProduct',
    component: () => import('@/pages/product/AddProductPage.vue'),
    meta: {
      middlewares: [isAuthenticated, isVerified, isInTenant],
    },
  },
  {
    path: '/products/:id/show',
    name: 'showProduct',
    component: () => import('@/pages/product/ShowProductPage.vue'),
    meta: {
      middlewares: [isAuthenticated, isVerified, isInTenant],
    },
    children: [
      {
        path: 'overview',
        name: 'showProductOverview',
        component: () => import('@/pages/product/ShowProductOverviewPage.vue'),
      },
      {
        path: 'comments',
        name: 'showProductComments',
        component: () => import('@/pages/product/ShowProductCommentsPage.vue'),
      },
      {
        path: 'logs',
        name: 'showProductLogs',
        component: () => import('@/pages/product/ShowProductLogsPage.vue'),
      },
    ],
  },
  {
    path: '/products/:id/edit',
    name: 'editProduct',
    component: () => import('@/pages/product/EditProductPage.vue'),
    meta: {
      middlewares: [isAuthenticated, isVerified, isInTenant],
    },
  },
]
