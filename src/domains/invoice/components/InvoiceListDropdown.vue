<script setup lang="ts">
import { Cog, Download, MoreHorizontal } from 'lucide-vue-next'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from '@/components/ui/button/Button.vue'
import DropdownMenu from '@/components/ui/dropdown-menu/DropdownMenu.vue'
import DropdownMenuContent from '@/components/ui/dropdown-menu/DropdownMenuContent.vue'
import DropdownMenuItem from '@/components/ui/dropdown-menu/DropdownMenuItem.vue'
import DropdownMenuTrigger from '@/components/ui/dropdown-menu/DropdownMenuTrigger.vue'
import { useToast } from '@/components/ui/toast'
import { downloadBlob } from '@/lib/downloadBlob'
import { type IInvoiceFilters, invoiceService } from '../services/invoiceService'

const { t } = useI18n()
const { toast } = useToast()

const { filters } = defineProps<{
  filters: IInvoiceFilters
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
        <MoreHorizontal class="size-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="space-y-1">
      <DropdownMenuItem class="cursor-pointer" @click="exportToExcel()">
        <Download class="size-4 mr-2" />
        <span>{{ t('common.export.excel') }}</span>
      </DropdownMenuItem>
      <DropdownMenuItem disabled>
        <Cog class="size-4 mr-2" />
        <span>{{ t('common.settings') }}</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>