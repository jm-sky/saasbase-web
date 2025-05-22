<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useTenantInvitationStore } from '@/domains/tenant/store/tenantInvitation.store'

const { t } = useI18n()
const store = useTenantInvitationStore()

const invitation = store.invitation
</script>

<template>
  <div v-if="invitation" class="rounded-lg border p-4 bg-muted">
    <div class="text-sm font-medium">
      {{ t('invitation.title') }}
    </div>
    <div class="text-sm text-muted-foreground">
      {{ t('invitation.info', {
        user: invitation.inviter.name,
        tenant: invitation.tenant.name,
        role: invitation.role
      }) }}
    </div>
  </div>
</template>
