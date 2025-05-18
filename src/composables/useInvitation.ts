import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { invitationService } from '@/domains/tenant/services/InvitationService'
import type { IInvitation } from '@/domains/tenant/types/invitation.type'

export function useInvitation() {
  const route = useRoute()
  const invitation = ref<IInvitation | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const token = route.query.token as string | undefined

  const loadInvitation = async () => {
    if (!token) return

    try {
      loading.value = true
      error.value = null
      invitation.value = await invitationService.show(token)
    } catch {
      error.value = 'Failed to load invitation'
      invitation.value = null
    } finally {
      loading.value = false
    }
  }

  const acceptInvitation = async () => {
    if (!token) return

    try {
      loading.value = true
      error.value = null
      invitation.value = await invitationService.accept(token)
      return invitation.value
    } catch {
      error.value = 'Failed to accept invitation'
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    token,
    invitation,
    loading,
    error,
    loadInvitation,
    acceptInvitation,
  }
}
