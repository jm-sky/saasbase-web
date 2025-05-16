<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import DataListSection from '@/components/DataLists/DataListSection.vue'
import NoItems from '@/components/DataLists/NoItems.vue'
import { tenantBankAccountsService } from '@/domains/tenant/services/TenantBankAccountsService'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import TenantAddBankAccountModal from './TenantAddBankAccountModal.vue'
import TenantBankAccountsListItem from './TenantBankAccountsListItem.vue'
import TenantEditBankAccountModal from './TenantEditBankAccountModal.vue'
import type { ITenantBankAccount } from '@/domains/tenant/types/tenant.type'

const route = useRoute()
const { t } = useI18n()

const tenantId = route.params.id as string
const bankAccounts = ref<ITenantBankAccount[]>([])
const loading = ref(false)
const addModalOpen = ref(false)
const editModalOpen = ref(false)
const editBankAccount = ref<ITenantBankAccount>()

const refresh = async () => {
  loading.value = true
  try {
    const res = await tenantBankAccountsService.index(tenantId)
    bankAccounts.value = res.data
  } catch (error) {
    handleErrorWithToast(t('bankAccounts.error.fetchingBankAccounts'), error)
  } finally {
    loading.value = false
  }
}

onMounted(refresh)

const handleEdit = (bankAccount: ITenantBankAccount) => {
  editBankAccount.value = bankAccount
  editModalOpen.value = true
}

const handleSetDefault = async (bankAccount: ITenantBankAccount) => {
  try {
    await tenantBankAccountsService.setDefault(tenantId, bankAccount.id)
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
      <TenantBankAccountsListItem
        v-for="bankAccount in bankAccounts"
        :key="bankAccount.id"
        :tenant-id="tenantId"
        :bank-account="bankAccount"
        @set-default="handleSetDefault"
        @edit="handleEdit"
        @deleted="refresh"
      />
      <NoItems v-if="bankAccounts.length === 0" />
    </div>

    <TenantAddBankAccountModal
      v-model:open="addModalOpen"
      :tenant-id="tenantId"
      @create="refresh"
    />

    <TenantEditBankAccountModal
      v-if="editBankAccount"
      v-model:open="editModalOpen"
      :tenant-id="tenantId"
      :bank-account="editBankAccount"
      @update="refresh"
    />
  </DataListSection>
</template>
