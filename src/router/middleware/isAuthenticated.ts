import { useAuthStore } from '@/domains/auth/store/auth.store'
import type { RouterMiddlewareOptions } from '@/router/hooks/runMiddlewarePipeline'

export const isAuthenticated = ({ next }: RouterMiddlewareOptions) => {
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    next({ name: 'login' }); return
  }

  next()
}
