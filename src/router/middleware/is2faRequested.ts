import { useAuthStore } from '@/domains/auth/store/auth.store'
import { routeMap } from '@/router/routeMap'
import type { RouterMiddlewareOptions } from '@/router/hooks/runMiddlewarePipeline'

export const is2faRequested = ({ next, to }: RouterMiddlewareOptions) => {
  const authStore = useAuthStore()

  if (authStore.isTwoFactorEnabled && !authStore.isTwoFactorPassed && to.name !== routeMap.auth.mfaVerify) {
    next({ name: routeMap.auth.mfaVerify }); return
  }

  next()
}
