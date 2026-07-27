import type { RouteRecordRaw } from 'vue-router'

export const publicRoutes: RouteRecordRaw[] = [
  {
    path: '/landing',
    name: 'landing',
    component: () => import('@/pages/public/LandingPage.vue'),
  },
  {
    path: '/shared/invoices/:token',
    name: 'sharedInvoice',
    component: () => import('@/pages/public/SharedInvoicePage.vue'),
  },
  {
    path: '/terms',
    name: 'terms',
    component: () => import('@/pages/public/TermsPage.vue'),
  },
  {
    path: '/privacy',
    name: 'privacy',
    component: () => import('@/pages/public/PrivacyPage.vue'),
  },
]
