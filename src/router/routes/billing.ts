import type { RouteRecordRaw } from 'vue-router'

export const billingRoutes: RouteRecordRaw[] = [
  {
    path: '/billing/checkout/success',
    name: 'checkoutSuccess',
    component: () => import('@/pages/billing/CheckoutSuccessPage.vue'),
  },
  {
    path: '/billing/checkout/cancel',
    name: 'checkoutCancel',
    component: () => import('@/pages/billing/CheckoutCancelPage.vue'),
  },
]