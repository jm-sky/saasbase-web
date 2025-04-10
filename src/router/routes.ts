import { isAuthenticated } from '@/router/middleware/isAuthenticated'
import { authRoutes } from '@/router/routes/auth'
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
      middlewares: [isAuthenticated],
    },
  },

  ...authRoutes,
  ...publicRoutes,
  ...settingsRoutes,

  {
    path: '/mailbox/:box?',
    name: 'mailbox',
    component: () => import('@/views/MailBoxView.vue'),
  },
  {
    path: '/users/:id',
    name: 'userProfile',
    component: () => import('@/views/users/UserProfileView.vue'),
  },
]
