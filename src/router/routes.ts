import { isAuthenticated } from '@/router/middleware/isAuthenticated';
import LoginView from '@/views/auth/LoginView.vue';
import HomeView from '@/views/HomeView.vue';
import type { RouteRecordRaw } from 'vue-router';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      middlewares: [isAuthenticated],
    },
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/password-forgot',
    name: 'passwordForgot',
    component: () => import('@/views/auth/ForgotPasswordView.vue'),
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/auth/RegisterView.vue'),
  },
  {
    path: '/terms',
    name: 'terms',
    component: () => import('@/views/public/TermsView.vue'),
  },
  {
    path: '/privacy',
    name: 'privacy',
    component: () => import('@/views/public/PrivacyView.vue'),
  },
  {
    path: '/mailbox',
    name: 'mailbox',
    component: () => import('@/views/MailBoxView.vue'),
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/SettingsView.vue'),
  },
  {
    path: '/users/:id',
    name: 'userProfile',
    component: () => import('@/views/users/UserProfileView.vue'),
  },
];
