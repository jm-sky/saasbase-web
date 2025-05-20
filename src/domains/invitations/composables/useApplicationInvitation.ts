import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { applicationInvitationService } from '../services/applicationInvitation.service'
import { useApplicationInvitationStore } from '../store/applicationInvitation.store'

export const useInvitation = () => {
  const route = useRoute()
  const store = useApplicationInvitationStore()
  const loading = ref(false)
  const error = ref<string | null>(null)

  const token = route.query.applicationInvitationToken as string | undefined

  const loadInvitation = async () => {
    if (!token) return

    try {
      loading.value = true
      error.value = null
      store.setInvitationToken(token)
      const invitation = await applicationInvitationService.show(token)
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
      const invitation = await applicationInvitationService.accept(token)
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
      await applicationInvitationService.reject(token)
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
