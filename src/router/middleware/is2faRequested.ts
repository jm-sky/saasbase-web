import { type RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/domains/auth/store/auth.store'

export const is2faRequested = (to: RouteLocationNormalized) => {
  const authStore = useAuthStore()

  if (authStore.isTwoFactorEnabled && !authStore.isTwoFactorPassed) {
    if (to.name !== '2fa-verify') {
      return { name: '2fa-verify' }
    }
  }

  return true
}
