import { StorageSerializers, useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed, ref, } from 'vue'
import { config } from '@/config'
import { User } from '@/domains/user/models/user.model'
import { type IUser } from '@/domains/user/types/user.type'
import { authService } from '../services/authService'
import type { TUUID } from '@/domains/shared/types/common'

export interface BaseJwtPayload {
  iss: string;    // Issuer of the token
  iat: number;    // Issued at (Unix timestamp)
  exp: number;    // Expiration time (Unix timestamp)
  nbf: number;    // Not valid before (Unix timestamp)
  sub: string;    // Subject (user ID)
  jti: string;    // JWT ID (unique identifier)
}

export interface JwtPayload extends BaseJwtPayload {
  ev: 0 | 1;      // Email verification status (0: not verified, 1: verified)
  mfa?: 1 | 2;    // Two factor status (1: enabled but not passed, 2: enabled and passed)
  tid?: string;   // Tenant ID (UUID, only present in tenant-scoped tokens)
  rem?: 0 | 1;    // Remember me status (0: not remembered, 1: remembered)
}


const extractJwt = (token?: string | null): JwtPayload | null => {
  try {
    const payload64 = token?.split('.').at(1)

    if (!payload64) return null

    return JSON.parse(atob(payload64))

  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  const token = useLocalStorage<null | string>(`${config.appId}:token`, null)
  const userData = useLocalStorage<null | IUser>(`${config.appId}:user`, null, { serializer: StorageSerializers.object})
  const showAuthModal = ref(false)
  const showSelectTenantModal = ref(false)
  const isAuthenticated = computed<boolean>(() => !!token.value)
  const jwtPayload = computed<null | JwtPayload>(() => extractJwt(token.value))
  const tenantId = computed<null | TUUID>(() => jwtPayload.value?.tid ?? null)
  const isInTenant = computed<boolean>(() => !!tenantId.value)
  const isEmailVerified = computed<boolean>(() => jwtPayload.value?.ev === 1)
  const isTwoFactorEnabled = computed<boolean>(() => jwtPayload.value?.mfa === 1)
  const isTwoFactorPassed = computed<boolean>(() => jwtPayload.value?.mfa === 2)

  const user = computed<undefined | User>(() => userData.value ? User.load(userData.value) : undefined)

  const setToken = (newToken: string) => token.value = newToken
  const clearToken = () => token.value = null

  const clearData = () => {
    clearToken()
    userData.value = null
    showAuthModal.value = false
    showSelectTenantModal.value = false
  }

  const setUser = (newUser: IUser) => userData.value = newUser
  const refresh = async () => setUser(await authService.getMe())

  return {
    token,
    userData,
    showAuthModal,
    showSelectTenantModal,
    user,
    jwtPayload,
    isAuthenticated,
    isEmailVerified,
    isTwoFactorEnabled,
    isTwoFactorPassed,
    isInTenant,
    tenantId,
    setToken,
    setUser,
    clearToken,
    clearData,
    refresh,
  }
})
