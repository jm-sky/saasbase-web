import { authService } from '@/domains/auth/services/authService'
import { useAuthStore } from '@/domains/auth/store/auth.store'
import type { RouterMiddlewareOptions } from '@/router/hooks/runMiddlewarePipeline'

export const isAuthenticated = async ({ next }: RouterMiddlewareOptions) => {
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    next({ name: 'login' }); return
  }

  if (!authStore.user) {
    const user = await authService.getMe()
    authStore.setUser(user)
  }

  next()
}
