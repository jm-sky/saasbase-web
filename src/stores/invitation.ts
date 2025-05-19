import { useSessionStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import type { IInvitation } from '@/domains/tenant/types/invitation.type'

export const useInvitationStore = defineStore('invitation', () => {
  const invitationToken = useSessionStorage<string | null>('invitationToken', null)
  const invitation = useSessionStorage<IInvitation | null>('invitation', null)

  const setInvitationToken = (token: string | null) => {
    invitationToken.value = token
  }

  const setInvitation = (inv: IInvitation | null) => {
    invitation.value = inv
  }

  const clearInvitation = () => {
    invitationToken.value = null
    invitation.value = null
  }

  return {
    invitationToken,
    invitation,
    setInvitationToken,
    setInvitation,
    clearInvitation,
  }
})
