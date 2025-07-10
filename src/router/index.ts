import { createRouter, createWebHistory } from 'vue-router'
import { useMiddleware } from '@/router/useMiddleware'
import { setRouteTitle } from './helpers/setRouteTitle'
import { routes } from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkActiveClass: 'active',
  linkExactActiveClass: 'exact-active',
})

useMiddleware({ router })

router.afterEach((to) => {
  setRouteTitle(to)
})

export default router
