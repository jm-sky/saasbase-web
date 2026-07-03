<script setup lang="ts">
import { Copy } from 'lucide-vue-next'
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

// No dedicated duplicate endpoint exists, and building one requires a
// product decision this fix shouldn't invent (numbering is client-supplied
// and unique per tenant — a real "copy" needs a defined answer for what
// number/status the duplicate gets). Previously faked a delay then claimed
// success regardless, which was actively misleading rather than just an
// unfinished feature.
const copyInvoice = () => {
  toast.info(t('invoice.actions.notImplemented'))
}
</script>

<template>
  <Button
    v-if="variant === 'button'"
    variant="outline"
    size="sm"
    :disabled="!invoice && !invoices?.length"
    @click="copyInvoice"
  >
    <Copy class="size-4" />
    {{ t('invoice.actions.copy.title', 'Copy') }}
  </Button>
  <DropdownMenuItem
    v-else
    hoverable
    :disabled="!invoice && !invoices?.length"
    @click="copyInvoice"
  >
    <Copy class="size-4 mr-2" />
    {{ t('invoice.actions.copy.title', 'Copy') }}
  </DropdownMenuItem>
</template>
