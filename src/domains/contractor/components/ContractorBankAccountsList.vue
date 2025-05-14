<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { contractorBankAccountsService } from '@/domains/contractor/services/ContractorBankAccountsService'
import type { IContractorBankAccount } from '@/domains/contractor/models/contractor.model'

const route = useRoute()
const contractorId = route.params.id as string
const bankAccounts = ref<IContractorBankAccount[]>([])
const loading = ref(false)

const fetchBankAccounts = async () => {
  loading.value = true
  try {
    const res = await contractorBankAccountsService.index(contractorId)
    bankAccounts.value = res.data
  } finally {
    loading.value = false
  }
}

onMounted(fetchBankAccounts)

const handleAdd = () => {
  // TODO: implement modal/form
}
const handleEdit = (_account: IContractorBankAccount) => {
  // TODO: implement modal/form
  console.log(_account)
}
const handleDelete = async (account: IContractorBankAccount) => {
  await contractorBankAccountsService.delete(contractorId, account.id)
  await fetchBankAccounts()
}
</script>
<template>
  <div>
    <div class="flex justify-between items-center mb-2">
      <div class="font-bold">
        Bank accounts
      </div>
      <button class="btn btn-primary" @click="handleAdd">
        Add
      </button>
    </div>
    <div v-if="loading">
      Loading...
    </div>
    <div v-else>
      <table class="min-w-full text-sm">
        <thead>
          <tr>
            <th>Bank name</th>
            <th>IBAN</th>
            <th>Currencies</th>
            <th>Default</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="account in bankAccounts" :key="account.id">
            <td>{{ account.bankName }}</td>
            <td>{{ account.iban }}</td>
            <td>{{ account.currencies.join(', ') }}</td>
            <td>{{ account.isDefault ? 'Yes' : 'No' }}</td>
            <td>
              <button class="btn btn-xs btn-secondary mr-1" @click="handleEdit(account)">
                Edit
              </button>
              <button class="btn btn-xs btn-danger" @click="handleDelete(account)">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
