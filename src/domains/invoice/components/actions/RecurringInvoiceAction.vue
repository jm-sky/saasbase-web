<script setup lang="ts">
import { Repeat } from 'lucide-vue-next'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useToast } from '@/components/ui/toast'
import type { IInvoice } from '../../types/invoice.type'

const { t } = useI18n()
const { toast } = useToast()

defineProps<{
  invoice?: IInvoice
  invoices?: IInvoice[]
  variant?: 'button' | 'menu-item'
}>()

const loading = ref(false)

const setupRecurring = async () => {
  loading.value = true
  try {
    // TODO: Implement service integration - open recurring setup modal
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.success(t('invoice.actions.recurring.success', 'Recurring invoice configured successfully'))
  } catch (error) {
    console.error('Failed to configure recurring invoice:', error)
    toast.error(t('invoice.actions.recurring.error', 'Failed to configure recurring invoice'))
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <Button
    v-if="variant === 'button'"
    variant="outline"
    size="sm"
    :disabled="loading || (!invoice && !invoices?.length)"
    @click="setupRecurring"
  >
    <Repeat class="size-4" />
    {{ t('invoice.actions.recurring.title', 'Setup Recurring') }}
  </Button>
  <DropdownMenuItem
    v-else
    hoverable
    :disabled="loading || (!invoice && !invoices?.length)"
    @click="setupRecurring"
  >
    <Repeat class="size-4 mr-2" />
    {{ t('invoice.actions.recurring.title', 'Setup Recurring') }}
  </DropdownMenuItem>
</template>
