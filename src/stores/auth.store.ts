import { useSessionStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { computed } from 'vue';
import { User, type IUserData } from '@/models/user.model';

export type SessionData = {
  id: string
  user: IUserData
  startedAt: string
  expiresAt: string
}

export const useAuthStore = defineStore('auth', () => {
  const session = useSessionStorage<SessionData | null>('auth:session', null, {
    serializer: {
      read: (v: any) => v ? JSON.parse(v) : null,
      write: (v: any) => JSON.stringify(v),
    },
  });

  const isAuthenticated = computed<boolean>(() => !!session.value?.id);
  const user = computed<User | undefined>(() => session.value?.user ? User.load(session.value.user) : undefined);

  return {
    session,
    user,
    isAuthenticated,
  };
});
