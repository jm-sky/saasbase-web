<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import DataListSection from '@/components/DataLists/DataListSection.vue'
import NoItems from '@/components/DataLists/NoItems.vue'
import { contractorContactsService } from '@/domains/contractor/services/ContractorContactsService'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import ContractorAddContactModal from './ContractorAddContactModal.vue'
import ContractorContactsListItem from './ContractorContactsListItem.vue'
import ContractorEditContactModal from './ContractorEditContactModal.vue'
import type { IContractorContact } from '@/domains/contractor/types/contractor.type'

const route = useRoute()
const { t } = useI18n()

const contractorId = route.params.id as string
const contacts = ref<IContractorContact[]>([])
const loading = ref(false)
const addModalOpen = ref(false)
const editModalOpen = ref(false)
const editContact = ref<IContractorContact>()

const refresh = async () => {
  loading.value = true
  try {
    const res = await contractorContactsService.index(contractorId)
    contacts.value = res.data
  } catch (error) {
    handleErrorWithToast(t('contacts.error.fetchingContacts'), error)
  } finally {
    loading.value = false
  }
}

onMounted(refresh)

const handleEdit = (contact: IContractorContact) => {
  editContact.value = contact
  editModalOpen.value = true
}

const handleDelete = async (contact: IContractorContact) => {
  try {
    if (!confirm(t('contacts.deleteConfirmation'))) return
    await contractorContactsService.delete(contractorId, contact.id)
    await refresh()
  } catch (error) {
    handleErrorWithToast(t('contacts.delete.error'), error)
  }
}
</script>

<template>
  <DataListSection
    :title="t('contacts.title')"
    :loading="loading"
    @refresh="refresh"
    @add="addModalOpen = true"
  >
    <div class="flex flex-col gap-2" :class="{ 'opacity-50': loading }">
      <ContractorContactsListItem
        v-for="contact in contacts"
        :key="contact.id"
        :contact="contact"
        @edit="handleEdit"
        @delete="handleDelete"
      />
      <NoItems v-if="contacts.length === 0" />
    </div>

    <ContractorAddContactModal
      v-model:open="addModalOpen"
      :contractor-id="contractorId"
      @create="refresh"
    />

    <ContractorEditContactModal
      v-if="editContact"
      v-model:open="editModalOpen"
      :contractor-id="contractorId"
      :contact="editContact"
      @update="refresh"
    />
  </DataListSection>
</template>
