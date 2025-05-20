import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { tenantInvitationService } from '@/domains/tenant/services/TenantInvitationService'
import { useTenantInvitationStore } from '@/domains/tenant/store/tenantInvitation.store'

export const useInvitation = () => {
  const route = useRoute()
  const store = useTenantInvitationStore()
  const loading = ref(false)
  const error = ref<string | null>(null)

  const token = route.query.tenantInvitationToken as string | undefined

  const loadInvitation = async () => {
    if (!token) return

    try {
      loading.value = true
      error.value = null
      store.setInvitationToken(token)
      const invitation = await tenantInvitationService.show(token)
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
      const invitation = await tenantInvitationService.accept(token)
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
      await tenantInvitationService.reject(token)
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
