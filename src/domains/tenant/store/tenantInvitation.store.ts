import { StorageSerializers, useSessionStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { config } from '@/config'
import type { ITenantInvitation } from '@/domains/tenant/types/invitation.type'

export const useTenantInvitationStore = defineStore('tenantInvitation', () => {
  const invitationToken = useSessionStorage<string | null>(`${config.appId}:tenantInvitationToken`, null)
  const invitation = useSessionStorage<ITenantInvitation | null>(`${config.appId}:tenantInvitation`, null, { serializer: StorageSerializers.object })

  const setInvitationToken = (token: string | null) => {
    invitationToken.value = token
  }

  const setInvitation = (inv: ITenantInvitation | null) => {
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
