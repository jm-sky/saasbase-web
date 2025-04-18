import { isAuthenticated } from '@/router/middleware/isAuthenticated'
import type { RouteRecordRaw } from 'vue-router'

export const productRoutes: RouteRecordRaw[] = [
  {
    path: '/products',
    name: 'products',
    component: () => import('@/views/product/ProductListView.vue'),
    meta: {
      middlewares: [isAuthenticated],
    },
  },
]
