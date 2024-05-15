import LoginView from '@/views/auth/LoginView.vue';
import HomeView from '@/views/HomeView.vue';

export const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
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
];
