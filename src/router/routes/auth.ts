import LoginView from '@/pages/auth/LoginPage.vue'
import PrettyLoginView from '@/pages/auth/LoginPage.vue'
import { isAuthenticated } from '@/router/middleware/isAuthenticated'
import { isVerified } from '@/router/middleware/isVerified'
import { routeMap } from '@/router/routeMap'
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
    component: () => import('@/pages/auth/ForgotPasswordPage.vue'),
  },
  {
    path: '/register',
    name: routeMap.auth.register,
    component: () => import('@/pages/auth/RegisterPage.vue'),
  },
  {
    path: '/verify-email',
    name: routeMap.auth.verifyEmail,
    component: () => import('@/pages/auth/VerifyEmailPage.vue'),
    meta: {
      middlewares: [isAuthenticated],
    },
  },
  {
    path: '/2fa-verify',
    name: routeMap.auth.mfaVerify,
    component: () => import('@/pages/auth/2faVerifyPage.vue'),
    meta: {
      middlewares: [isAuthenticated, isVerified],
    },
  },
  {
    path: '/select-tenant',
    name: routeMap.auth.selectTenant,
    component: () => import('@/pages/tenant/SelectTenantPage.vue'),
    meta: {
      middlewares: [isAuthenticated, isVerified],
    },
  },
  {
    path: '/email/verify',
    name: 'verify-email',
    component: () => import('@/pages/auth/EmailVerificationPage.vue'),
    meta: {
      title: 'Verify Email'
    }
  },
  {
    path: '/oauth/callback',
    name: 'oauth-callback',
    component: () => import('@/pages/auth/OAuth2CallbackPage.vue'),
    meta: {
      title: 'OAuth2 Callback'
    }
  }
]
