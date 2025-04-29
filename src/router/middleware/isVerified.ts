import { useAuthStore } from '@/domains/auth/store/auth.store'
import { routeMap } from '@/router/routeMap'
import type { RouterMiddlewareOptions } from '@/router/hooks/runMiddlewarePipeline'

export const isVerified = ({ next }: RouterMiddlewareOptions) => {
  const authStore = useAuthStore()

  if (!authStore.isEmailVerified) {
    next({ name: routeMap.auth.verifyEmail }); return
  }

  next()
}
