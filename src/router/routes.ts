import HomeView from '@/pages/HomePage.vue'
import { isAuthenticated } from '@/router/middleware/isAuthenticated'
import { isInTenant } from '@/router/middleware/isInTenant'
import { isVerified } from '@/router/middleware/isVerified'
import { authRoutes } from '@/router/routes/auth'
import { contractorRoutes } from '@/router/routes/contractor'
import { feedRoutes } from '@/router/routes/feeds'
import { productRoutes } from '@/router/routes/product'
import { publicRoutes } from '@/router/routes/public'
import { settingsRoutes } from '@/router/routes/settings'
import { tenantRoutes } from '@/router/routes/tenant'
import { routeMap } from './routeMap'
import { billingRoutes } from './routes/billing'
import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    redirect: '/dashboard',
  },

  {
    path: '/dashboard',
    name: 'dashboard',
    component: HomeView,
    meta: {
      middlewares: [isAuthenticated, isVerified],
    },
  },

  {
    path: '/invitation/accept',
    name: routeMap.invitation.accept,
    component: () => import('@/pages/invitation/AcceptInvitationPage.vue'),
  },

  ...authRoutes,
  ...publicRoutes,
  ...settingsRoutes,
  ...contractorRoutes,
  ...productRoutes,
  ...tenantRoutes,
  ...feedRoutes,
  ...billingRoutes,

  {
    path: '/chat/:roomId?',
    name: 'chat',
    component: () => import('@/pages/chat/ChatPage.vue'),
    meta: {
      middlewares: [isAuthenticated, isVerified, isInTenant],
    },
  },

  {
    path: '/mailbox/:box?',
    name: 'mailbox',
    component: () => import('@/pages/MailBoxPage.vue'),
    meta: {
      middlewares: [isAuthenticated, isVerified],
    },
  },
  {
    path: '/users/:id',
    name: routeMap.userPublicProfile,
    component: () => import('@/pages/users/UserProfilePage.vue'),
    meta: {
      middlewares: [isAuthenticated, isVerified],
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/Error404Page.vue'),
  },
]
