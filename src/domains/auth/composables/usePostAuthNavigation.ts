import { useRouter } from 'vue-router'
import { authService } from '@/domains/auth/services/authService'
import { useAuthStore } from '@/domains/auth/store/auth.store'
import { routeMap } from '@/router/routeMap'
import { useNextRedirect } from '@/lib/useNextRedirect'

export const usePostAuthNavigation = () => {
  const router = useRouter()
  const authStore = useAuthStore()
  const { redirectTo } = useNextRedirect()

  const needsTwoFactorVerification = () => {
    return authStore.isTwoFactorEnabled && !authStore.isTwoFactorPassed
  }

  const navigateAfterAuthentication = async (next?: string) => {
    if (needsTwoFactorVerification()) {
      const destination = next ?? redirectTo.value
      await router.push({
        name: routeMap.auth.mfaVerify,
        query: destination && destination !== '/' ? { next: destination } : undefined,
      })
      return
    }

    authStore.setUser(await authService.getMe())
    await router.push(next ?? redirectTo.value)
  }

  return {
    needsTwoFactorVerification,
    navigateAfterAuthentication,
  }
}
