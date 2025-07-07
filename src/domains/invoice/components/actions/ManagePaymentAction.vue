<script setup lang="ts">
import { CreditCard } from 'lucide-vue-next'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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

const managePayment = async (action: 'attach' | 'generate') => {
  loading.value = true
  try {
    // TODO: Implement service integration
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.success(t(`invoice.actions.payment.${action}.success`, `Payment ${action}ed successfully`))
  } catch (error) {
    console.error(`Failed to ${action} payment:`, error)
    toast.error(t(`invoice.actions.payment.${action}.error`, `Failed to ${action} payment`))
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        v-if="variant === 'button'"
        variant="outline"
        size="sm"
        :disabled="loading || (!invoice && !invoices?.length)"
      >
        <CreditCard class="size-4" />
        {{ t('invoice.actions.payment.title', 'Manage Payment') }}
      </Button>
      <DropdownMenuItem
        v-else
        hoverable
        :disabled="loading || (!invoice && !invoices?.length)"
      >
        <CreditCard class="size-4 mr-2" />
        {{ t('invoice.actions.payment.title', 'Manage Payment') }}
      </DropdownMenuItem>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem
        class="cursor-pointer"
        @click="managePayment('attach')"
      >
        {{ t('invoice.actions.payment.attach', 'Attach Payment') }}
      </DropdownMenuItem>
      <DropdownMenuItem
        class="cursor-pointer"
        @click="managePayment('generate')"
      >
        {{ t('invoice.actions.payment.generate', 'Generate Payment') }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
