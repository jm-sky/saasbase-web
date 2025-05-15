<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { contractorAddressesService } from '@/domains/contractor/services/ContractorAddressesService'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import DataListSection from '../DataListSection.vue'
import ContractorAddAddressModal from './ContractorAddAddressModal.vue'
import ContractorAddressesListItem from './ContractorAddressesListItem.vue'
import ContractorEditAddressModal from './ContractorEditAddressModal.vue'
import type { IContractorAddress } from '@/domains/contractor/models/contractor.model'

const route = useRoute()
const { t } = useI18n()

const contractorId = route.params.id as string
const addresses = ref<IContractorAddress[]>([])
const loading = ref(false)
const addModalOpen = ref(false)
const editModalOpen = ref(false)
const editAddress = ref<IContractorAddress>()

const refresh = async () => {
  loading.value = true
  try {
    const res = await contractorAddressesService.index(contractorId)
    addresses.value = res.data
  } catch (error) {
    handleErrorWithToast(t('address.error.fetchingAddresses'), error)
  } finally {
    loading.value = false
  }
}

onMounted(refresh)

const handleEdit = (address: IContractorAddress) => {
  editAddress.value = address
  editModalOpen.value = true
}

const handleSetDefault = async (address: IContractorAddress) => {
  try {
    await contractorAddressesService.setDefault(contractorId, address.id)
    await refresh()
  } catch (error) {
    handleErrorWithToast(t('address.error.settingDefaultAddress'), error)
  }
}

const handleDelete = async (address: IContractorAddress) => {
  try {
    if (!confirm(t('address.deleteConfirmation'))) return
    await contractorAddressesService.delete(contractorId, address.id)
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
      <ContractorAddressesListItem
        v-for="address in addresses"
        :key="address.id"
        :address="address"
        @set-default="handleSetDefault"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>

    <ContractorAddAddressModal
      v-model:open="addModalOpen"
      :contractor-id="contractorId"
      @create="refresh"
    />

    <ContractorEditAddressModal
      v-if="editAddress"
      v-model:open="editModalOpen"
      :contractor-id="contractorId"
      :address="editAddress"
      @update="refresh"
    />
  </DataListSection>
</template>
