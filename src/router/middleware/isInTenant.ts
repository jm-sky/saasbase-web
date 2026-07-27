import { useAuthStore } from '@/domains/auth/store/auth.store'
import { routeMap } from '@/router/routeMap'
import type { RouterMiddlewareOptions } from '@/router/hooks/runMiddlewarePipeline'

export const isInTenant = ({ to, next }: RouterMiddlewareOptions) => {
  const authStore = useAuthStore()

  if (!authStore.isInTenant) {
    next({
      name: routeMap.auth.selectTenant,
      query: to.fullPath && to.fullPath !== '/' ? { next: to.fullPath } : undefined,
    })
    return
  }

  next()
}
