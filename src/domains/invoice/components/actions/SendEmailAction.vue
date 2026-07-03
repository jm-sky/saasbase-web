<script setup lang="ts">
import { Mail } from 'lucide-vue-next'
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

// No backend endpoint exists for this yet — previously faked a delay then
// claimed success regardless, which was actively misleading rather than
// just an unfinished feature.
const sendEmail = () => {
  toast.info(t('invoice.actions.notImplemented'))
}
</script>

<template>
  <Button
    v-if="variant === 'button'"
    variant="outline"
    size="sm"
    :disabled="!invoice && !invoices?.length"
    @click="sendEmail"
  >
    <Mail class="size-4" />
    {{ t('invoice.actions.sendEmail.title', 'Send Email') }}
  </Button>
  <DropdownMenuItem
    v-else
    hoverable
    :disabled="!invoice && !invoices?.length"
    @click="sendEmail"
  >
    <Mail class="size-4 mr-2" />
    {{ t('invoice.actions.sendEmail.title', 'Send Email') }}
  </DropdownMenuItem>
</template>
