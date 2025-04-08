import { routeMap } from '@/router/routeMap'
import LoginView from '@/views/auth/LoginView.vue'
import type { RouteRecordRaw } from 'vue-router'

export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: routeMap.auth.login,
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
]
