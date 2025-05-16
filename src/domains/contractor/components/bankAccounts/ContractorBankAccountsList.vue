<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import DataListSection from '@/components/DataLists/DataListSection.vue'
import NoItems from '@/components/DataLists/NoItems.vue'
import { contractorBankAccountsService } from '@/domains/contractor/services/ContractorBankAccountsService'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import ContractorAddBankAccountModal from './ContractorAddBankAccountModal.vue'
import ContractorBankAccountsListItem from './ContractorBankAccountsListItem.vue'
import ContractorEditBankAccountModal from './ContractorEditBankAccountModal.vue'
import type { IContractorBankAccount } from '@/domains/contractor/models/contractor.model'

const route = useRoute()
const { t } = useI18n()

const contractorId = route.params.id as string
const bankAccounts = ref<IContractorBankAccount[]>([])
const loading = ref(false)
const addModalOpen = ref(false)
const editModalOpen = ref(false)
const editBankAccount = ref<IContractorBankAccount>()

const refresh = async () => {
  loading.value = true
  try {
    const res = await contractorBankAccountsService.index(contractorId)
    bankAccounts.value = res.data
  } catch (error) {
    handleErrorWithToast(t('bankAccounts.error.fetchingBankAccounts'), error)
  } finally {
    loading.value = false
  }
}

onMounted(refresh)

const handleEdit = (bankAccount: IContractorBankAccount) => {
  editBankAccount.value = bankAccount
  editModalOpen.value = true
}

const handleSetDefault = async (bankAccount: IContractorBankAccount) => {
  try {
    await contractorBankAccountsService.setDefault(contractorId, bankAccount.id)
    await refresh()
  } catch (error) {
    handleErrorWithToast(t('bankAccounts.error.settingDefaultBankAccount'), error)
  }
}

</script>

<template>
  <DataListSection
    :title="t('bankAccounts.title')"
    :loading="loading"
    @refresh="refresh"
    @add="addModalOpen = true"
  >
    <div class="flex flex-col gap-2" :class="{ 'opacity-50': loading }">
      <ContractorBankAccountsListItem
        v-for="bankAccount in bankAccounts"
        :key="bankAccount.id"
        :contractor-id="contractorId"
        :bank-account="bankAccount"
        @set-default="handleSetDefault"
        @edit="handleEdit"
        @deleted="refresh"
      />
      <NoItems v-if="bankAccounts.length === 0" />
    </div>

    <ContractorAddBankAccountModal
      v-model:open="addModalOpen"
      :contractor-id="contractorId"
      @create="refresh"
    />

    <ContractorEditBankAccountModal
      v-if="editBankAccount"
      v-model:open="editModalOpen"
      :contractor-id="contractorId"
      :bank-account="editBankAccount"
      @update="refresh"
    />
  </DataListSection>
</template>
