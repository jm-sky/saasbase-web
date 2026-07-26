<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { useDeleteProduct } from '@/domains/product/composables/useProductMutations'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'

const { t } = useI18n()

const props = defineProps<{
  id: string
}>()

const { mutateAsync: deleteProductMutation, isPending: loading } = useDeleteProduct()

const deleteProduct = async () => {
  if (!confirm(t('product.delete.confirm', 'Are you sure you want to delete this product?'))) return
  try {
    await deleteProductMutation(props.id)
    toast.success(t('product.delete.success'))
  } catch (error) {
    handleErrorWithToast(t('product.delete.error', 'Failed to delete product'), error)
  }
}
</script>

<template>
  <Button
    v-tooltip="t('common.delete', 'Delete')"
    variant="destructive"
    size="sm"
    :loading
    :disabled="loading"
    @click="deleteProduct"
  >
    <Trash2 />
  </Button>
</template>
