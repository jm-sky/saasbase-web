import { computed } from 'vue'
import { useAuthStore } from '@/domains/auth/store/auth.store'
import { OWNER_OR_ADMIN_ROLES, type TRoleName } from '@/domains/rights/types/roleName'

export const useCan = () => {
  const authStore = useAuthStore()

  const roles = computed(() => authStore.user?.roles ?? [])

  const hasRole = (role: TRoleName | string): boolean => roles.value.includes(role)

  const hasAnyRole = (names: readonly (TRoleName | string)[]): boolean =>
    names.some((name) => roles.value.includes(name))

  const isOwnerOrAdmin = computed(() => hasAnyRole(OWNER_OR_ADMIN_ROLES))

  return {
    roles,
    hasRole,
    hasAnyRole,
    isOwnerOrAdmin,
  }
}
