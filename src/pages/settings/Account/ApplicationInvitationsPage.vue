<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import NoItems from '@/components/DataLists/NoItems.vue'
import Separator from '@/components/ui/separator/Separator.vue'
import ApplicationInvitationForm from '@/domains/invitations/components/invitations/ApplicationInvitationForm.vue'
import ApplicationInvitationsList from '@/domains/invitations/components/invitations/ApplicationInvitationsList.vue'
import { applicationInvitationService } from '@/domains/invitations/services/applicationInvitation.service'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import SettingsHeader from '../partials/SettingsHeader.vue'
import type { IApplicationInvitation } from '@/domains/invitations/types/invitation.type'

const { t } = useI18n()

const invitations = ref<IApplicationInvitation[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const loadInvitations = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await applicationInvitationService.list()
    invitations.value = response.data
  } catch (err) {
    handleErrorWithToast(t('invitation.list.error'), err)
    error.value = 'Failed to load invitations'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  void loadInvitations()
})
</script>

<template>
  <SettingsHeader :title="t('invitation.title')" :description="t('invitation.description')" />

  <Separator />

  <ApplicationInvitationForm @sent="invitations.push($event)" />

  <Separator />

  <SettingsHeader
    :title="t('invitation.list.title')"
    :loading
    refresh
    @refresh="loadInvitations"
  />

  <Separator />

  <div v-if="loading" class="p-4 text-center text-muted-foreground">
    {{ t('invitation.list.loading') }}
  </div>

  <div v-else-if="error" class="p-4 text-center text-destructive">
    {{ error }}
  </div>

  <NoItems v-else-if="invitations.length === 0" :message="t('invitation.list.empty')" />

  <ApplicationInvitationsList v-else v-model:invitations="invitations" />
</template>
