import { StorageSerializers, useLocalStorage, useSessionStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed, watch } from 'vue'
import { config } from '@/config'
import { User } from '@/domains/user/models/user.model'
import { type IUser } from '@/domains/user/types/user.type'
import { setApiAuthorization } from '@/helpers/api'

export interface SessionData {
  id: string
  user: IUser
  startedAt: string
  expiresAt: string
}

export const useAuthStore = defineStore('auth', () => {
  const token = useLocalStorage<null | string>(`${config.appId}:token`, null)
  const session = useSessionStorage<null | SessionData>(`${config.appId}:session`, null, { serializer: StorageSerializers.object })

  const isAuthenticated = computed<boolean>(() => !!session.value?.id)
  const userData = computed<undefined | IUser>(() => session.value?.user)
  const user = computed<undefined | User>(() => userData.value ? User.load(userData.value) : undefined)

  const setToken = (newToken: string) => {
    token.value = newToken
    setApiAuthorization(newToken)
  }

  const clearToken = () => token.value = null
  const clearData = () => {
    clearToken()
    session.value = null
  }

  // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
  watch(token, () => setApiAuthorization(token.value), {
    immediate: true,
  })

  return {
    token,
    session,
    user,
    userData,
    isAuthenticated,
    setToken,
    clearToken,
    clearData,
  }
})
