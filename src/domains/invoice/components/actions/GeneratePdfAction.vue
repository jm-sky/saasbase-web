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
import type { IInvoice } from '../../types/invoice.type'

const { t } = useI18n()
const { toast } = useToast()

defineProps<{
  invoice?: IInvoice
  invoices?: IInvoice[]
  variant?: 'button' | 'menu-item'
}>()

const loading = ref(false)

const generatePdf = async (type: 'original' | 'duplicate') => {
  loading.value = true
  try {
    // TODO: Implement service integration
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.success(t(`invoice.actions.generatePdf.${type}.success`, `${type} PDF generated successfully`))
  } catch (error) {
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

      <DropdownMenuItem class="cursor-pointer" disabled>
        {{ t('invoice.actions.generatePdf.more', 'More options') }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
