<script setup lang="ts">
import { Cog, Download, MoreVertical, Settings } from 'lucide-vue-next'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from '@/components/ui/button/Button.vue'
import DropdownMenu from '@/components/ui/dropdown-menu/DropdownMenu.vue'
import DropdownMenuContent from '@/components/ui/dropdown-menu/DropdownMenuContent.vue'
import DropdownMenuItem from '@/components/ui/dropdown-menu/DropdownMenuItem.vue'
import DropdownMenuSeparator from '@/components/ui/dropdown-menu/DropdownMenuSeparator.vue'
import DropdownMenuTrigger from '@/components/ui/dropdown-menu/DropdownMenuTrigger.vue'
import { useToast } from '@/components/ui/toast'
import { downloadBlob } from '@/lib/downloadBlob'
import type { IInvoice } from '../types/invoice.type'
import { type IInvoiceFilters, invoiceService } from '../services/invoiceService'
import ChangeStatusAction from './actions/ChangeStatusAction.vue'
import CopyInvoiceAction from './actions/CopyInvoiceAction.vue'
import ExportBankTransferAction from './actions/ExportBankTransferAction.vue'
import GeneratePdfAction from './actions/GeneratePdfAction.vue'
import ManagePaymentAction from './actions/ManagePaymentAction.vue'
import ManageRelationshipsAction from './actions/ManageRelationshipsAction.vue'
import ManageRemindersAction from './actions/ManageRemindersAction.vue'
import RecurringInvoiceAction from './actions/RecurringInvoiceAction.vue'
import SendEmailAction from './actions/SendEmailAction.vue'
import SendToKsefAction from './actions/SendToKsefAction.vue'
import SharePublicLinkAction from './actions/SharePublicLinkAction.vue'

const { t } = useI18n()
const { toast } = useToast()

const { filters, invoice, selectedInvoices } = defineProps<{
  filters: IInvoiceFilters
  invoice?: IInvoice
  selectedInvoices?: IInvoice[]
}>()

const loading = ref(false)

const exportToExcel = async () => {
  try {
    loading.value = true
    const blob = await invoiceService.export(filters)
    downloadBlob(blob, 'invoices.xlsx')
    loading.value = false
  } catch (error) {
    toast.error(t('common.export.error'))
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost">
        <MoreVertical class="size-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-56">
      <!-- Export/Import Actions -->
      <DropdownMenuItem class="cursor-pointer" @click="exportToExcel()">
        <Download class="size-4 mr-2" />
        <span>{{ t('common.export.excel') }}</span>
      </DropdownMenuItem>

      <DropdownMenuSeparator />

      <!-- Core Actions -->
      <ChangeStatusAction variant="menu-item" :invoice="invoice" :invoices="selectedInvoices" />
      <CopyInvoiceAction variant="menu-item" :invoice="invoice" :invoices="selectedInvoices" />

      <DropdownMenuSeparator />

      <!-- Communication -->
      <SendEmailAction variant="menu-item" :invoice="invoice" :invoices="selectedInvoices" />
      <SendToKsefAction variant="menu-item" :invoice="invoice" :invoices="selectedInvoices" />

      <DropdownMenuSeparator />

      <!-- Documents -->
      <GeneratePdfAction variant="menu-item" :invoice="invoice" :invoices="selectedInvoices" />
      <SharePublicLinkAction variant="menu-item" :invoice="invoice" :invoices="selectedInvoices" />

      <DropdownMenuSeparator />

      <!-- Financial -->
      <ManagePaymentAction variant="menu-item" :invoice="invoice" :invoices="selectedInvoices" />
      <ExportBankTransferAction variant="menu-item" :invoice="invoice" :invoices="selectedInvoices" />

      <DropdownMenuSeparator />

      <!-- Management -->
      <ManageRemindersAction variant="menu-item" :invoice="invoice" :invoices="selectedInvoices" />
      <ManageRelationshipsAction variant="menu-item" :invoice="invoice" :invoices="selectedInvoices" />
      <RecurringInvoiceAction variant="menu-item" :invoice="invoice" :invoices="selectedInvoices" />

      <DropdownMenuSeparator />

      <!-- Settings -->
      <DropdownMenuItem class="cursor-pointer" disabled>
        <Settings class="size-4 mr-2" />
        {{ t('invoice.actions.settings', 'Invoice Settings') }}
      </DropdownMenuItem>

      <DropdownMenuItem disabled>
        <Cog class="size-4 mr-2" />
        <span>{{ t('common.settings') }}</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
