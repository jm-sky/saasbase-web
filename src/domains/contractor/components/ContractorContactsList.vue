<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import Button from '@/components/ui/button/Button.vue'
import { contractorContactsService } from '@/domains/contractor/services/ContractorContactsService'
import type { IContractorContactPerson } from '@/domains/contractor/models/contractor.model'

const route = useRoute()
const contractorId = route.params.id as string
const contacts = ref<IContractorContactPerson[]>([])
const loading = ref(false)

const fetchContacts = async () => {
  loading.value = true
  try {
    const res = await contractorContactsService.index(contractorId)
    contacts.value = res.data
  } finally {
    loading.value = false
  }
}

onMounted(fetchContacts)

const handleAdd = () => {
  // TODO: implement modal/form
}
const handleEdit = (_contact: IContractorContactPerson) => {
  // TODO: implement modal/form
  console.log(_contact)
}
const handleDelete = async (contact: IContractorContactPerson) => {
  await contractorContactsService.delete(contractorId, contact.id)
  await fetchContacts()
}
</script>
<template>
  <div>
    <div class="flex justify-between items-center mb-2">
      <div class="font-bold">
        Contact persons
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
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Position</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="contact in contacts" :key="contact.id">
            <td>{{ contact.name }}</td>
            <td>{{ contact.email }}</td>
            <td>{{ contact.phone }}</td>
            <td>{{ contact.position }}</td>
            <td>
              <Button
                size="sm"
                variant="secondary"
                class="mr-1"
                @click="handleEdit(contact)"
              >
                Edit
              </Button>
              <Button size="sm" variant="destructive" @click="handleDelete(contact)">
                Delete
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!loading && contacts.length === 0" class="my-4 text-center text-sm text-muted-foreground">
        No contact persons found
      </div>
    </div>
  </div>
</template>
