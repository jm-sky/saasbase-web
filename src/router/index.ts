import { createRouter, createWebHistory } from 'vue-router'
import { useMiddleware } from '@/router/useMiddleware'
import { setRouteTitle } from './helpers/setRouteTitle'
import { useRouteLoading } from './routeLoading'
import { routes } from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkActiveClass: 'active',
  linkExactActiveClass: 'exact-active',
})

router.beforeEach((to) => {
  setRouteTitle(to)
})

useRouteLoading(router)
useMiddleware({ router })

router.afterEach((to) => {
  setRouteTitle(to)
})

export default router
