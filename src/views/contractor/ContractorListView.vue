<script setup lang="ts">
import { RefreshCw } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import ButtonLink from '@/components/ButtonLink.vue' <!-- Ensure ButtonLink is imported -->
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
</script>
Here is the rest of the corrected code to replace the "Add Contractor" button:

```vue
} from '@/components/ui/table'
import { formatDate } from '@/helpers/date'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { contractorService } from '@/services/contractorService'
import type { Contractor } from '@/models/contractor.model'

const contractors = ref<Contractor[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const fetchContractors = async () => {
  try {
    loading.value = true
    error.value = null
    contractors.value = await contractorService.index()
  } catch (err) {
    error.value = 'Failed to load contractors'
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  void fetchContractors()
})
</script>

<template>
  <AuthenticatedLayout>
    <div class="container mx-auto py-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">
          Contractors
        </h1>
        <div class="flex gap-2">
          <Button variant="outline" @click="fetchContractors">
            <RefreshCw class="h-4 w-4" />
          </Button>
          <ButtonLink to="/contractors/add">Add Contractor</ButtonLink> <!-- Updated to ButtonLink -->
        </div>
      </div>

      <div v-if="loading" class="text-center py-8">
        Loading contractors...
      </div>

      <div v-else-if="error" class="text-center py-8 text-red-500">
        {{ error }}
      </div>

      <div v-else class="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Tax ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="contractor in contractors" :key="contractor.id">
              <TableCell>{{ contractor.name }}</TableCell>
              <TableCell>{{ contractor.taxId || '-' }}</TableCell>
              <TableCell>
                <div class="flex gap-2">
                  <Badge v-if="contractor.isSupplier" variant="secondary">
                    Supplier
                  </Badge>
                  <Badge v-if="contractor.isBuyer" variant="secondary">
                    Buyer
                  </Badge>
                </div>
              </TableCell>
              <TableCell>{{ formatDate(contractor.createdAt) }}</TableCell>
              <TableCell>
                <div class="flex gap-2">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm">
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  </AuthenticatedLayout>
</template>