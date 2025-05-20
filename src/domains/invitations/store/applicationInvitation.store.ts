import { useSessionStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { config } from '@/config'
import type { IApplicationInvitation } from '../types/invitation.type'

export const useApplicationInvitationStore = defineStore('applicationInvitation', () => {
  const invitationToken = useSessionStorage<string | null>(`${config.appId}:applicationInvitationToken`, null)
  const invitation = useSessionStorage<IApplicationInvitation | null>(`${config.appId}:applicationInvitation`, null)

  const setInvitationToken = (token: string | null) => {
    invitationToken.value = token
  }

  const setInvitation = (inv: IApplicationInvitation | null) => {
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
