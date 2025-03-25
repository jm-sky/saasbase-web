import { useLocalStorage, useSessionStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed, watch } from 'vue'
import { config } from '@/config'
import { setAuthToken } from '@/helpers/api'
import { type IUserData, User } from '@/models/user.model'

export interface SessionData {
  id: string
  user: IUserData
  startedAt: string
  expiresAt: string
}

export const useAuthStore = defineStore('auth', () => {
  const token = useLocalStorage<null | string>(`${config.appId}:token`, null)
  const session = useSessionStorage<null | SessionData>(`${config.appId}:session`, null, {
    serializer: {
      read: (v: unknown) => v ? JSON.parse(v as string) : null,
      write: (v: unknown) => JSON.stringify(v),
    },
  })

  const isAuthenticated = computed<boolean>(() => !!session.value?.id)
  const user = computed<undefined | User>(() => session.value?.user ? User.load(session.value.user) : undefined)

  const setToken = (newToken: string) => token.value = newToken
  const clearToken = () => token.value = null

  const clearData = () => {
    clearToken()
    session.value = null
  }

  // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
  watch(token, () => setAuthToken(token.value), {
    immediate: true,
  })

  return {
    token,
    session,
    user,
    isAuthenticated,
    setToken,
    clearToken,
    clearData,
  }
})
