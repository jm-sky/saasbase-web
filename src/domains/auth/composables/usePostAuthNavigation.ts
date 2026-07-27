import { useRouter } from 'vue-router'
import { authService } from '@/domains/auth/services/authService'
import { useAuthStore } from '@/domains/auth/store/auth.store'
import { useNextRedirect } from '@/lib/useNextRedirect'
import { routeMap } from '@/router/routeMap'

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

    const destination = next ?? redirectTo.value

    // No tenant in JWT yet → always land on the select-tenant page first
    // (covers 1+ memberships; empty list offers create-tenant CTA).
    if (!authStore.isInTenant) {
      await router.push({
        name: routeMap.auth.selectTenant,
        query: destination && destination !== '/' ? { next: destination } : undefined,
      })
      return
    }

    await router.push(destination)
  }

  return {
    needsTwoFactorVerification,
    navigateAfterAuthentication,
  }
}
