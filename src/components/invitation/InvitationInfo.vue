<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useInvitationStore } from '@/stores/invitation'

const { t } = useI18n()
const store = useInvitationStore()

const invitation = store.invitation
</script>

<template>
  <div v-if="invitation" class="rounded-lg border p-4 bg-muted">
    <div class="text-sm font-medium">
      {{ t('invitation.title') }}
    </div>
    <div class="text-sm text-muted-foreground">
      {{ t('invitation.description', {
        user: invitation.inviter.name,
        tenant: invitation.tenant.name,
        role: invitation.role
      }) }}
    </div>
  </div>
</template>
