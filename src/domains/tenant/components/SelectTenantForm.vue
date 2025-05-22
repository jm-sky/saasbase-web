<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ButtonLink from '@/components/ButtonLink.vue'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import { useLogout } from '@/domains/auth/composables/useLogout'
import { tenantService } from '@/domains/tenant/services/TenantService'
import type { ITenantPreview } from '@/domains/tenant/types/tenant.type'

const { toast } = useToast()
const { logout } = useLogout()
const { t } = useI18n()

const emit = defineEmits<{
  selected: [tenantId: string]
}>()

const tenants = ref<ITenantPreview[]>([])

const handleSelectTenant = async (tenantId: string) => {
  try {
    await tenantService.switch(tenantId)
    emit('selected', tenantId)
  } catch {
    toast.error('Could not switch tenant')
  }
}

const fetchTenants = async () => {
  const tenantsData = await tenantService.index()
  tenants.value = tenantsData
}

onMounted(async () => {
  await fetchTenants()
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <div v-if="tenants.length === 0" class="flex flex-col gap-4 text-center text-sm p-2">
      <div>{{ t('auth.selectTenant.noTenants') }}</div>
      <div>
        <ButtonLink variant="default" to="/tenant/create">
          {{ t('auth.selectTenant.createTenant') }}
        </ButtonLink>
      </div>
    </div>
    <div
      v-for="tenant in tenants"
      :key="tenant.id"
      class="flex items-center justify-between p-4 rounded-lg border bg-white/30 hover:bg-accent cursor-pointer transition-colors"
      @click="handleSelectTenant(tenant.id)"
    >
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          {{ tenant.name.charAt(0) }}
        </div>
        <div>
          <div class="font-medium">
            {{ tenant.name }}
          </div>
        </div>
      </div>
      <Button variant="ghost" size="sm">
        {{ t('auth.selectTenant.selectTenant') }}
      </Button>
    </div>

    <div class="text-center mt-4">
      <Button variant="ghost" size="sm" @click="logout">
        {{ t('auth.signOut') }}
      </Button>
    </div>
  </div>
</template>
