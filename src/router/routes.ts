import { isAuthenticated } from '@/router/middleware/isAuthenticated'
import { isVerified } from '@/router/middleware/isVerified'
import { authRoutes } from '@/router/routes/auth'
import { contractorRoutes } from '@/router/routes/contractor'
import { productRoutes } from '@/router/routes/product'
import { publicRoutes } from '@/router/routes/public'
import { settingsRoutes } from '@/router/routes/settings'
import HomeView from '@/views/HomeView.vue'
import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      middlewares: [isAuthenticated, isVerified],
    },
  },

  ...authRoutes,
  ...publicRoutes,
  ...settingsRoutes,
  ...contractorRoutes,
  ...productRoutes,

  {
    path: '/mailbox/:box?',
    name: 'mailbox',
    component: () => import('@/views/MailBoxView.vue'),
    meta: {
      middlewares: [isAuthenticated, isVerified],
    },
  },
  {
    path: '/users/:id',
    name: 'userProfile',
    component: () => import('@/views/users/UserProfileView.vue'),
    meta: {
      middlewares: [isAuthenticated, isVerified],
    },
  },
]
