import { authService } from '@/domains/auth/services/authService'
import { useAuthStore } from '@/domains/auth/store/auth.store'
import { clearFailedQueue } from '@/lib/api/interceptUnauthorized'
import type { Credentials } from '@/domains/auth/types/auth.type'

export const useLogin = () => {
  const login = async (credentials: Credentials) => {
    const authStore = useAuthStore()

    await authService.login(credentials)
    authStore.setUser(await authService.getMe())
    clearFailedQueue()
  }

  return { login }
}
