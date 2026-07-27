import { type RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/domains/auth/store/auth.store'
import { routeMap } from '@/router/routeMap'

export const is2faRequested = (to: RouteLocationNormalized) => {
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    return true
  }

  if (authStore.isTwoFactorEnabled && !authStore.isTwoFactorPassed) {
    if (to.name !== routeMap.auth.mfaVerify) {
      return { name: routeMap.auth.mfaVerify }
    }
  }

  return true
}
