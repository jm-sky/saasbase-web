import { useRouter } from 'vue-router'
import { authService } from '@/domains/auth/services/authService'
import { useAuthStore } from '@/domains/auth/store/auth.store'
import { routeTo } from '@/router/routeMap'

export const useLogout = () => {
  const router = useRouter()

  const logout = async () => {
    useAuthStore().clearData()
    await authService.logout()
    await router.push(routeTo.login())
  }

  return { logout }
}
