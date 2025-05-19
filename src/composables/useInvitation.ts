import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { invitationService } from '@/domains/tenant/services/InvitationService'
import { useInvitationStore } from '@/stores/invitation'

export const useInvitation = () => {
  const route = useRoute()
  const store = useInvitationStore()
  const loading = ref(false)
  const error = ref<string | null>(null)

  const token = route.query.invitationToken as string | undefined

  const loadInvitation = async () => {
    if (!token) return

    try {
      loading.value = true
      error.value = null
      store.setInvitationToken(token)
      const invitation = await invitationService.show(token)
      store.setInvitation(invitation)
    } catch {
      error.value = 'Failed to load invitation'
      store.clearInvitation()
    } finally {
      loading.value = false
    }
  }

  const acceptInvitation = async () => {
    if (!token) return

    try {
      loading.value = true
      error.value = null
      const invitation = await invitationService.accept(token)
      store.setInvitation(invitation)
      return invitation
    } catch {
      error.value = 'Failed to accept invitation'
      store.clearInvitation()
      return null
    } finally {
      loading.value = false
    }
  }

  const declineInvitation = async () => {
    if (!token) return

    try {
      loading.value = true
      error.value = null
      await invitationService.reject(token)
      store.clearInvitation()
    } catch {
      error.value = 'Failed to decline invitation'
    } finally {
      loading.value = false
    }
  }

  return {
    token,
    invitation: store.invitation,
    loading,
    error,
    loadInvitation,
    acceptInvitation,
    declineInvitation,
  }
}
