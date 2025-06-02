<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import DataListSection from '@/components/DataLists/DataListSection.vue'
import NoItems from '@/components/DataLists/NoItems.vue'
import { tenantAddressesService } from '@/domains/tenant/services/TenantAddressesService'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import TenantAddAddressModal from './TenantAddAddressModal.vue'
import TenantAddressesListItem from './TenantAddressesListItem.vue'
import TenantEditAddressModal from './TenantEditAddressModal.vue'
import type { ITenantAddress } from '@/domains/tenant/types/tenant.type'

const route = useRoute()
const { t } = useI18n()

const tenantId = route.params.id as string
const addresses = ref<ITenantAddress[]>([])
const loading = ref(false)
const addModalOpen = ref(false)
const editModalOpen = ref(false)
const editAddress = ref<ITenantAddress>()

const refresh = async () => {
  loading.value = true
  try {
    const res = await tenantAddressesService.index(tenantId)
    addresses.value = res.data
  } catch (error) {
    handleErrorWithToast(t('address.error.fetchingAddresses'), error)
  } finally {
    loading.value = false
  }
}

onMounted(refresh)

const handleEdit = (address: ITenantAddress) => {
  editAddress.value = address
  editModalOpen.value = true
}

const handleSetDefault = async (address: ITenantAddress) => {
  try {
    await tenantAddressesService.setDefault(tenantId, address.id)
    await refresh()
  } catch (error) {
    handleErrorWithToast(t('address.error.settingDefaultAddress'), error)
  }
}

const handleDelete = async (address: ITenantAddress) => {
  try {
    if (!confirm(t('address.delete.confirmation'))) return
    await tenantAddressesService.delete(tenantId, address.id)
    await refresh()
  } catch (error) {
    handleErrorWithToast(t('address.delete.error'), error)
  }
}
</script>

<template>
  <DataListSection
    :title="t('address.title')"
    :loading="loading"
    @refresh="refresh"
    @add="addModalOpen = true"
  >
    <div class="flex flex-col gap-2" :class="{ 'opacity-50': loading }">
      <TenantAddressesListItem
        v-for="address in addresses"
        :key="address.id"
        :address="address"
        @set-default="handleSetDefault"
        @edit="handleEdit"
        @delete="handleDelete"
      />
      <NoItems v-if="addresses.length === 0" />
    </div>

    <TenantAddAddressModal
      v-model:open="addModalOpen"
      :tenant-id="tenantId"
      @create="refresh"
    />

    <TenantEditAddressModal
      v-if="editAddress"
      v-model:open="editModalOpen"
      :tenant-id="tenantId"
      :address="editAddress"
      @update="refresh"
    />
  </DataListSection>
</template>
