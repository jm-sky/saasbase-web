import { authService } from '@/domains/auth/services/authService'
import { useAuthStore } from '@/domains/auth/store/auth.store'
import { useRepatcha } from '@/domains/shared/composables/useRepatcha'
import { clearFailedQueue } from '@/lib/api/interceptUnauthorized'
import type { Credentials } from '@/domains/auth/types/auth.type'

export const useLogin = () => {
  const login = async (credentials: Credentials) => {
    const authStore = useAuthStore()

    const token = await useRepatcha().getToken('login')
    credentials.recaptchaToken = token

    await authService.login(credentials)
    authStore.setUser(await authService.getMe())
    clearFailedQueue()
  }

  return { login }
}
