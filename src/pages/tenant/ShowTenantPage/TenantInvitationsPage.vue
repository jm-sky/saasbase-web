<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from '@/components/ui/button/Button.vue'
import RoleLookup from '@/domains/rights/components/RoleLookup.vue'
import { tenantInvitationService } from '@/domains/tenant/services/TenantInvitationService'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { toDateTimeString } from '@/lib/toDateTimeString'
import type { ITenantInvitation } from '@/domains/tenant/types/invitation.type'
import type { ITenant } from '@/domains/tenant/types/tenant.type'

const props = defineProps<{
  tenant: ITenant
}>()

const { t } = useI18n()

const invitations = ref<ITenantInvitation[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const email = ref('')
const role = ref('')

const loadInvitations = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await tenantInvitationService.list(props.tenant.id)
    invitations.value = response.data
  } catch (err) {
    handleErrorWithToast(t('tenant.invitations.list.error'), err)
    error.value = 'Failed to load invitations'
  } finally {
    loading.value = false
  }
}

const sendInvitation = async () => {
  try {
    loading.value = true
    error.value = null
    const invitation = await tenantInvitationService.send(props.tenant.id, {
      email: email.value,
      role: role.value,
    })
    invitations.value.push(invitation)
    email.value = ''
    role.value = ''
  } catch (err) {
    handleErrorWithToast(t('tenant.invitations.send.error'), err)
    error.value = 'Failed to send invitation'
  } finally {
    loading.value = false
  }
}

const cancelInvitation = async (invitation: ITenantInvitation) => {
  if (!confirm(t('tenant.invitations.delete.confirm'))) {
    return
  }

  try {
    loading.value = true
    error.value = null
    await tenantInvitationService.cancel(props.tenant.id, invitation.id)
    invitations.value = invitations.value.filter(i => i.id !== invitation.id)
  } catch (err) {
    handleErrorWithToast(t('tenant.invitations.delete.error'), err)
  } finally {
    loading.value = false
  }
}

const resendInvitation = async (invitation: ITenantInvitation) => {
  try {
    loading.value = true
    error.value = null
    const updatedInvitation = await tenantInvitationService.resend(props.tenant.id, invitation.id)
    const index = invitations.value.findIndex(i => i.id === invitation.id)
    if (index !== -1) {
      invitations.value[index] = updatedInvitation
    }
  } catch (err) {
    handleErrorWithToast(t('tenant.invitations.send.error'), err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  void loadInvitations()
})
</script>

<template>
  <div class="space-y-6">
    <div class="rounded-lg border p-4">
      <h3 class="text-lg font-medium">
        {{ t('tenant.invitations.send.title') }}
      </h3>
      <form class="mt-4 space-y-4" @submit.prevent="sendInvitation">
        <div>
          <label for="email" class="block text-sm font-medium">
            {{ t('tenant.invitations.send.email') }}
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
        </div>
        <div>
          <label for="role" class="block text-sm font-medium">
            {{ t('tenant.invitations.send.role') }}
          </label>
          <RoleLookup
            v-model="role"
            :disabled="loading"
          />
        </div>
        <Button
          type="submit"
          :disabled="loading"
          :loading="loading"
        >
          {{ t('tenant.invitations.send.submit') }}
        </Button>
      </form>
    </div>

    <div class="rounded-lg border">
      <div class="p-4">
        <h3 class="text-lg font-medium">
          {{ t('tenant.invitations.list.title') }}
        </h3>
      </div>
      <div class="border-t">
        <div v-if="loading" class="p-4 text-center text-muted-foreground">
          {{ t('tenant.invitations.list.loading') }}
        </div>
        <div v-else-if="error" class="p-4 text-center text-destructive">
          {{ error }}
        </div>
        <div v-else-if="invitations.length === 0" class="p-4 text-center text-muted-foreground">
          {{ t('tenant.invitations.list.empty') }}
        </div>
        <div v-else class="divide-y">
          <div
            v-for="invitation in invitations"
            :key="invitation.id"
            class="p-4"
          >
            <div class="flex items-center justify-between">
              <div>
                <div class="font-medium">
                  {{ invitation.email }}
                </div>
                <div class="text-sm text-muted-foreground">
                  {{ t('tenant.invitations.list.role') }}: {{ invitation.role }}
                </div>
                <div class="text-sm text-muted-foreground">
                  {{ t('tenant.invitations.list.status') }}: {{ invitation.status }}
                </div>
                <div class="text-sm text-muted-foreground">
                  {{ t('tenant.invitations.list.expires') }}: {{ toDateTimeString(invitation.expiresAt) }}
                </div>
              </div>
              <div class="flex space-x-2">
                <button
                  v-if="invitation.status === 'pending'"
                  :disabled="loading"
                  class="inline-flex items-center justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                  @click="resendInvitation(invitation)"
                >
                  {{ t('tenant.invitations.send.submit') }}
                </button>
                <button
                  v-if="invitation.status === 'pending'"
                  :disabled="loading"
                  class="inline-flex items-center justify-center rounded-md bg-destructive px-3 py-1.5 text-sm font-medium text-destructive-foreground ring-offset-background transition-colors hover:bg-destructive/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                  @click="cancelInvitation(invitation)"
                >
                  {{ t('common.delete') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
