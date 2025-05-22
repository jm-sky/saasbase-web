import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { tenantInvitationService } from '@/domains/tenant/services/TenantInvitationService'
import { useTenantInvitationStore } from '@/domains/tenant/store/tenantInvitation.store'

export const useInvitation = () => {
  const route = useRoute()
  const { t } = useI18n()
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
      error.value = t('invitation.load.error')
      store.clearInvitation()
    } finally {
      loading.value = false
    }
  }

  const acceptInvitation = async () => {
    if (!store.invitationToken) return

    try {
      loading.value = true
      error.value = null
      const invitation = await tenantInvitationService.accept(store.invitationToken)
      store.setInvitation(invitation)
      return invitation
    } catch {
      error.value = t('invitation.accept.error')
      store.clearInvitation()
    } finally {
      loading.value = false
    }
  }

  const declineInvitation = async () => {
    if (!store.invitationToken) return

    try {
      loading.value = true
      error.value = null
      await tenantInvitationService.reject(store.invitationToken)
      store.clearInvitation()
    } catch {
      error.value = t('invitation.decline.error')
    } finally {
      loading.value = false
    }
  }

  return {
    token,
    store,
    invitation: store.invitation,
    loading,
    error,
    loadInvitation,
    acceptInvitation,
    declineInvitation,
  }
}
