<script setup lang="ts">
import { RefreshCw } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDate } from '@/helpers/date'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { productService } from '@/services/productService'
import type { Product } from '@/models/product.model'

const products = ref<Product[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const fetchProducts = async () => {
  try {
    loading.value = true
    error.value = null
    products.value = await productService.index()
  } catch (err) {
    error.value = 'Failed to load products'
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  void fetchProducts()
})
</script>

<template>
  <AuthenticatedLayout>
    <div class="container mx-auto py-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">
          Products
        </h1>
        <div class="flex gap-2">
          <Button variant="outline" @click="fetchProducts">
            <RefreshCw class="h-4 w-4" />
          </Button>
          <Button>Add Product</Button>
        </div>
      </div>

      <div v-if="loading" class="text-center py-8">
        Loading products...
      </div>

      <div v-else-if="error" class="text-center py-8 text-red-500">
        {{ error }}
      </div>

      <div v-else class="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="product in products" :key="product.id">
              <TableCell>{{ product.name }}</TableCell>
              <TableCell>{{ product.description || '-' }}</TableCell>
              <TableCell>{{ product.priceNet.toFixed(2) }}</TableCell>
              <TableCell>{{ formatDate(product.createdAt) }}</TableCell>
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
