<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast/use-toast'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { productService } from '../services/productService'

const { toast } = useToast()
const { t } = useI18n()

const props = defineProps<{
  id: string
}>()

const loading = ref(false)

const deleteProduct = async () => {
  if (!confirm(t('product.delete.confirm', 'Are you sure you want to delete this product?'))) return
  try {
    loading.value = true
    await productService.delete(props.id)
    loading.value = false
    toast.success(t('product.delete.success'))
  } catch (error) {
    loading.value = false
    handleErrorWithToast(t('product.delete.error', 'Failed to delete product'), error)
  }
}
</script>

<template>
  <Button
    v-tooltip="t('common.delete', 'Delete')"
    variant="destructive"
    size="sm"
    :loading="loading"
    :disabled="loading"
    @click="deleteProduct"
  >
    <Trash2 />
  </Button>
</template>
