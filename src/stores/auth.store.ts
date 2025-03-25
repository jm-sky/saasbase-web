import { useSessionStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed } from 'vue'
import { type IUserData, User } from '@/models/user.model'

export interface SessionData {
  expiresAt: string
  id: string
  startedAt: string
  user: IUserData
}

export const useAuthStore = defineStore('auth', () => {
  const session = useSessionStorage<null | SessionData>('auth:session', null, {
    serializer: {
      read: (v: any) => v ? JSON.parse(v) : null,
      write: (v: any) => JSON.stringify(v),
    },
  })

  const isAuthenticated = computed<boolean>(() => !!session.value?.id)
  const user = computed<undefined | User>(() => session.value?.user ? User.load(session.value.user) : undefined)

  return {
    session,
    user,
    isAuthenticated,
  }
})
