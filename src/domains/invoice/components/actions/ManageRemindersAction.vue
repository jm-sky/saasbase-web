<script setup lang="ts">
import { Bell } from 'lucide-vue-next'
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

const manageReminders = async () => {
  loading.value = true
  try {
    // TODO: Implement service integration - open reminder modal
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.success(t('invoice.actions.reminders.success', 'Reminders managed successfully'))
  } catch (error) {
    console.error('Failed to manage reminders:', error)
    toast.error(t('invoice.actions.reminders.error', 'Failed to manage reminders'))
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
    @click="manageReminders"
  >
    <Bell class="size-4" />
    {{ t('invoice.actions.reminders.title', 'Manage Reminders') }}
  </Button>
  <DropdownMenuItem
    v-else
    hoverable
    :disabled="loading || (!invoice && !invoices?.length)"
    @click="manageReminders"
  >
    <Bell class="size-4 mr-2" />
    {{ t('invoice.actions.reminders.title', 'Manage Reminders') }}
  </DropdownMenuItem>
</template>
