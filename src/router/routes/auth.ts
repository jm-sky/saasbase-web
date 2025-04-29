import { isAuthenticated } from '@/router/middleware/isAuthenticated'
import { isVerified } from '@/router/middleware/isVerified'
import { routeMap } from '@/router/routeMap'
import LoginView from '@/views/auth/LoginView.vue'
import PrettyLoginView from '@/views/auth/PrettyLoginView.vue'
import type { RouteRecordRaw } from 'vue-router'

export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: routeMap.auth.login,
    component: PrettyLoginView,
  },
  {
    path: '/simple-login',
    component: LoginView,
  },
  {
    path: '/password-forgot',
    name: routeMap.auth.passwordForgot,
    component: () => import('@/views/auth/ForgotPasswordView.vue'),
  },
  {
    path: '/register',
    name: routeMap.auth.register,
    component: () => import('@/views/auth/RegisterView.vue'),
  },
  {
    path: '/verify-email',
    name: routeMap.auth.verifyEmail,
    component: () => import('@/views/auth/VerifyEmailView.vue'),
    meta: {
      middlewares: [isAuthenticated],
    },
  },
  {
    path: '/select-tenant',
    name: routeMap.auth.selectTenant,
    component: () => import('@/views/tenant/SelectTenantView.vue'),
    meta: {
      middlewares: [isAuthenticated, isVerified],
    },
  },
]
