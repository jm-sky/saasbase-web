<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import Button from '@/components/ui/button/Button.vue'
import { contractorAddressesService } from '@/domains/contractor/services/ContractorAddressesService'
import type { IContractorAddress } from '@/domains/contractor/models/contractor.model'

const route = useRoute()
const contractorId = route.params.id as string
const addresses = ref<IContractorAddress[]>([])
const loading = ref(false)

const fetchAddresses = async () => {
  loading.value = true
  try {
    const res = await contractorAddressesService.index(contractorId)
    addresses.value = res.data
  } finally {
    loading.value = false
  }
}

onMounted(fetchAddresses)

const handleAdd = () => {
  // TODO: implement modal/form
}
const handleEdit = (_address: IContractorAddress) => {
  // TODO: implement modal/form
  console.log(_address)
}
const handleDelete = async (address: IContractorAddress) => {
  await contractorAddressesService.delete(contractorId, address.id)
  await fetchAddresses()
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-2">
      <div class="font-bold">
        Addresses
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
            <th>Label</th>
            <th>Street</th>
            <th>City</th>
            <th>ZIP</th>
            <th>Country</th>
            <th>Default</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="address in addresses" :key="address.id">
            <td>{{ address.label }}</td>
            <td>{{ address.street }}</td>
            <td>{{ address.city }}</td>
            <td>{{ address.zip }}</td>
            <td>{{ address.countryId }}</td>
            <td>{{ address.isDefault ? 'Yes' : 'No' }}</td>
            <td class="flex flex-row gap-1 justify-end">
              <Button
                size="sm"
                variant="secondary"
                class="mr-1"
                @click="handleEdit(address)"
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="destructive"
                @click="handleDelete(address)"
              >
                Delete
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
