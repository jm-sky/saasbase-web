<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Avatar from '@/components/ui/avatar/Avatar.vue'
import AvatarFallback from '@/components/ui/avatar/AvatarFallback.vue'
import AvatarImage from '@/components/ui/avatar/AvatarImage.vue'
import Button from '@/components/ui/button/Button.vue'
import UIIcon from '@/components/UIIcon.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { toDateTimeString } from '@/lib/toDateTimeString'
import type { IApplicationInvitation } from '../../types/invitation.type'
import { applicationInvitationService } from '../../services/applicationInvitation.service'

const invitations = defineModel<IApplicationInvitation[]>('invitations', { required: true })

const { t } = useI18n()

const loading = ref(false)
const error = ref<string | null>(null)

const cancelInvitation = async (invitation: IApplicationInvitation) => {
  if (!confirm(t('invitation.delete.confirm'))) {
    return
  }

  try {
    loading.value = true
    error.value = null
    await applicationInvitationService.cancel(invitation.id)
    invitations.value = invitations.value.filter(i => i.id !== invitation.id)
  } catch (err) {
    handleErrorWithToast(t('invitation.delete.error'), err)
  } finally {
    loading.value = false
  }
}

const resendInvitation = async (invitation: IApplicationInvitation) => {
  try {
    loading.value = true
    error.value = null
    const updatedInvitation = await applicationInvitationService.resend(invitation.id)
    const index = invitations.value.findIndex(i => i.id === invitation.id)
    if (index !== -1) {
      invitations.value[index] = updatedInvitation
    }
  } catch (err) {
    handleErrorWithToast(t('invitation.send.error'), err)
  } finally {
    loading.value = false
  }
}

const getIcon = (status: IApplicationInvitation['status']) => {
  if (status === 'pending') return 'mdi:email'
  if (status === 'accepted') return 'mdi:check'
  return 'mdi:close'
}

const getStatusColor = (status: IApplicationInvitation['status']) => {
  if (status === 'pending') return 'text-primary'
  if (status === 'accepted') return 'text-success'
  return 'text-destructive'
}
</script>

<template>
  <div class="divide-y">
    <div
      v-for="invitation in invitations"
      :key="invitation.id"
      class="grid grid-cols-1 md:grid-cols-[3rem_1fr_1fr] items-center gap-4 p-4"
      :class="{ 'opacity-70': invitation.status === 'accepted' }"
    >
      <div class="p-2 items-center justify-center hidden md:flex">
        <UIIcon :icon="getIcon(invitation.status)" class="size-6" :class="getStatusColor(invitation.status)" />
      </div>

      <div class="w-auto grid grid-cols-1 md:grid-cols-2 gap-2">
        <div class="md:col-span-2 font-medium">
          {{ invitation.email }}
        </div>
        <div class="flex flex-col gap-1">
          <div class="text-sm text-muted-foreground">
            {{ t('invitation.list.invitedBy') }}: {{ invitation.inviter.name }}
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <div class="text-sm text-muted-foreground">
            {{ t('invitation.list.status') }}: {{ t(`invitations.status.${invitation.status}`) }}
          </div>
          <div class="text-sm text-muted-foreground">
            {{ t('invitation.list.expires') }}: {{ toDateTimeString(invitation.expiresAt) }}
          </div>
        </div>
      </div>

      <div class="flex items-center justify-center md:justify-end gap-2">
        <div v-if="invitation.invitedUser" class="flex flex-col items-center gap-1 text-sm">
          <Avatar size="base" class="">
            <AvatarImage :src="invitation.invitedUser.avatarUrl ?? ''" :alt="invitation.invitedUser.name" />
            <AvatarFallback>{{ invitation.invitedUser.name.slice(0, 2) ?? 'X' }}</AvatarFallback>
          </Avatar>
          <span class="text-xs text-muted-foreground">
            {{ invitation.invitedUser.name }}
          </span>
        </div>
        <Button
          v-if="invitation.status === 'pending'"
          variant="outline"
          :disabled="loading"
          @click="resendInvitation(invitation)"
        >
          {{ t('tenant.invitations.send.submit') }}
        </Button>
        <Button
          v-if="invitation.status === 'pending'"
          variant="destructive"
          :disabled="loading"
          @click="cancelInvitation(invitation)"
        >
          {{ t('common.delete') }}
        </Button>
      </div>
    </div>
  </div>
</template>
