<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { invitationService } from '@/domains/tenant/services/InvitationService'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { toDateTimeString } from '@/lib/toDateTimeString'
import type { IInvitation } from '@/domains/tenant/types/invitation.type'
import type { ITenant } from '@/domains/tenant/types/tenant.type'

const props = defineProps<{
  tenant: ITenant
}>()

const { t } = useI18n()

const invitations = ref<IInvitation[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const email = ref('')
const role = ref('')

const sendInvitation = async () => {
  try {
    loading.value = true
    error.value = null
    const invitation = await invitationService.send(props.tenant.id, {
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
          <select
            id="role"
            v-model="role"
            required
            class="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="admin">
              Admin
            </option>
            <option value="member">
              Member
            </option>
          </select>
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          {{ t('tenant.invitations.send.submit') }}
        </button>
      </form>
    </div>

    <div class="rounded-lg border">
      <div class="p-4">
        <h3 class="text-lg font-medium">
          {{ t('tenant.invitations.list.title') }}
        </h3>
      </div>
      <div class="border-t">
        <div v-if="invitations.length === 0" class="p-4 text-center text-muted-foreground">
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
                  {{ t('tenant.invitations.list.role', { role: invitation.role }) }}
                </div>
                <div class="text-sm text-muted-foreground">
                  {{ t('tenant.invitations.list.status', { status: invitation.status }) }}
                </div>
                <div class="text-sm text-muted-foreground">
                  {{ t('tenant.invitations.list.expires', { date: toDateTimeString(invitation.expiresAt) }) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
