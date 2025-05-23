import type { RouteRecordRaw } from 'vue-router'

export const publicRoutes: RouteRecordRaw[] = [
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
