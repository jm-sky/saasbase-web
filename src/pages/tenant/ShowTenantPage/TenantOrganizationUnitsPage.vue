<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import RefreshIconButton from '@/components/Buttons/RefreshIconButton.vue'
import Button from '@/components/ui/button/Button.vue'
import AddOrganizationUnitModal from '@/domains/tenant/components/organizationUnits/AddOrganizationUnitModal.vue'
import OrganizationUnitsTree from '@/domains/tenant/components/organizationUnits/OrganizationUnitsTree.vue'
import TenantSectionTitle from '@/domains/tenant/components/TenantSectionTitle.vue'
import { useTenant } from '@/domains/tenant/composables/useTenant'
import { tenantOrganizationUnitService } from '@/domains/tenant/services/TenantOrganizationUnit.service'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import type { IOrganizationUnit } from '@/domains/tenant/types/organizationUnit.type'
import type { ITenant } from '@/domains/tenant/types/tenant.type'

const { t } = useI18n()
const { tenantId } = useTenant()

defineProps<{
  tenant?: ITenant
}>()

const loading = ref(false)
const organizationUnits = ref<IOrganizationUnit[]>([])
const openAddOrganizationUnitModal = ref(false)

const refresh = async () => {
  try {
    loading.value = true
    const response = await tenantOrganizationUnitService.index(tenantId.value)
    organizationUnits.value = response.data
  } catch (error) {
    handleErrorWithToast(t('tenant.organizationUnits.error'), error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await refresh()
})
</script>

<template>
  <div class="flex flex-col gap-2 border rounded-md p-4 shadow-lg/5">
    <TenantSectionTitle :title="t('tenant.organizationUnits.title')">
      <template #actions>
        <Button variant="outline" @click="openAddOrganizationUnitModal = true">
          {{ t('tenant.organizationUnits.add.title') }}
        </Button>
        <RefreshIconButton :loading @click="refresh" />
      </template>
    </TenantSectionTitle>

    <OrganizationUnitsTree :organization-units />

    <AddOrganizationUnitModal
      :tenant-id="tenantId"
      :open="openAddOrganizationUnitModal"
      @created="refresh()"
    />
  </div>
</template>
