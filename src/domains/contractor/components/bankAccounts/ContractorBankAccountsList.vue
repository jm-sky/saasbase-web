<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import Button from '@/components/ui/button/Button.vue'
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
      <Button size="sm" variant="default" @click="handleAdd">
        Add
      </Button>
    </div>
    <div v-if="loading" class="my-4 text-center text-sm text-muted-foreground">
      Loading...
    </div>
    <div v-else>
      <table class="min-w-full text-sm">
        <thead>
          <tr>
            <th>IBAN</th>
            <th>Bank name</th>
            <th>Currencies</th>
            <th>Default</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="account in bankAccounts" :key="account.id">
            <td>{{ account.iban }}</td>
            <td>{{ account.bankName }}</td>
            <td>{{ account.currencies?.join(', ') ?? '-' }}</td>
            <td>{{ account.isDefault ? 'Yes' : 'No' }}</td>
            <td>
              <Button
                size="sm"
                variant="secondary"
                class="mr-1"
                @click="handleEdit(account)"
              >
                Edit
              </Button>
              <Button size="sm" variant="destructive" @click="handleDelete(account)">
                Delete
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!loading && bankAccounts.length === 0" class="my-4 text-center text-sm text-muted-foreground">
        No bank accounts found
      </div>
    </div>
  </div>
</template>
