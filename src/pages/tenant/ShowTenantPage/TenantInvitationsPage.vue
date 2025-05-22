<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import TenantInvitationForm from '@/domains/tenant/components/invitations/TenantInvitationForm.vue'
import TenantInvitationsList from '@/domains/tenant/components/invitations/TenantInvitationsList.vue'
import { tenantInvitationService } from '@/domains/tenant/services/TenantInvitationService'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import type { ITenantInvitation } from '@/domains/tenant/types/invitation.type'
import type { ITenant } from '@/domains/tenant/types/tenant.type'

const props = defineProps<{
  tenant: ITenant
}>()

const { t } = useI18n()

const invitations = ref<ITenantInvitation[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

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

onMounted(() => {
  void loadInvitations()
})
</script>

<template>
  <div class="space-y-6">
    <TenantInvitationForm :tenant @sent="invitations.push($event)" />

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

        <TenantInvitationsList
          v-else
          v-model:invitations="invitations"
          :tenant="tenant"
        />
      </div>
    </div>
  </div>
</template>
