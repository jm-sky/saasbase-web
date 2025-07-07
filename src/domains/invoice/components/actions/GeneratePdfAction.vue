<script setup lang="ts">
import { ArrowDown, FileDown } from 'lucide-vue-next'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import LoadingIcon from '@/components/Icons/LoadingIcon.vue'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Separator from '@/components/ui/separator/Separator.vue'
import { useToast } from '@/components/ui/toast'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import type { IInvoice } from '../../types/invoice.type'
import { invoiceService } from '../../services/invoiceService'
import GenerateInvoicePdfModal from '../modals/GenerateInvoicePdfModal.vue'

const { t } = useI18n()
const { toast } = useToast()

const props = defineProps<{
  invoice?: IInvoice | null
  invoices?: IInvoice[]
  variant?: 'button' | 'menu-item'
}>()

const emit = defineEmits<{
  done: [type: 'original' | 'duplicate']
}>()

const loading = ref(false)
const open = ref(false)

const invoiceOptions = {
  templateId: undefined,
  collection: undefined,
  action: undefined,
}

const generatePdf = async (type: 'original' | 'duplicate') => {
  if (!props.invoice?.id) return
  loading.value = true
  try {
    await invoiceService.generatePdf(props.invoice.id, invoiceOptions)
    toast.success(t(`invoice.actions.generatePdf.${type}.success`, `${type} PDF generated successfully`))
    emit('done', type)
  } catch (error) {
    handleErrorWithToast(t('invoice.actions.generatePdf.error', 'Failed to generate PDF'), error)
    console.error(`Failed to generate ${type} PDF:`, error)
    toast.error(t(`invoice.actions.generatePdf.${type}.error`, `Failed to generate ${type} PDF`))
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as="div" class="border rounded-md">
      <template v-if="variant === 'button'">
        <Button
          variant="ghost"
          size="sm"
          type="button"
          class="rounded-r-none border-r-1"
          :disabled="loading || (!invoice && !invoices?.length)"
          @click.stop.capture="generatePdf('original')"
        >
          <LoadingIcon v-if="loading" />
          <FileDown v-else class="size-4" />
          {{ t('invoice.actions.generatePdf.title', 'Generate PDF') }}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          class="rounded-l-none"
          :disabled="loading || (!invoice && !invoices?.length)"
        >
          <ArrowDown class="size-4" />
        </Button>
      </template>
      <DropdownMenuItem
        v-else
        hoverable
        :disabled="loading || (!invoice && !invoices?.length)"
      >
        <FileDown class="size-4 mr-2" />
        {{ t('invoice.actions.generatePdf.title', 'Generate PDF') }}
      </DropdownMenuItem>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem hoverable @click="generatePdf('original')">
        {{ t('invoice.actions.generatePdf.original', 'Original PDF') }}
      </DropdownMenuItem>
      <DropdownMenuItem hoverable @click="generatePdf('duplicate')">
        {{ t('invoice.actions.generatePdf.duplicate', 'Duplicate PDF') }}
      </DropdownMenuItem>

      <Separator class="my-2" />

      <DropdownMenuItem class="cursor-pointer" @click="open = true">
        {{ t('invoice.actions.generatePdf.more', 'More options') }}
      </DropdownMenuItem>
    </DropdownMenuContent>

    <GenerateInvoicePdfModal
      v-model:open="open"
      :invoice="invoice"
    />
  </DropdownMenu>
</template>
