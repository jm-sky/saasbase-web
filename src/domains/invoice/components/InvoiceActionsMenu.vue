<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import ButtonLink from '@/components/ButtonLink.vue'
import type { IInvoice } from '../types/invoice.type'
import SendEmailAction from './actions/SendEmailAction.vue'
import SendToKsefAction from './actions/SendToKsefAction.vue'

const { t } = useI18n()

 defineProps<{
  invoice?: IInvoice
  selectedRows?: IInvoice[]
}>()

defineEmits<{
  clearSelection: []
  refresh: []
}>()
</script>

<template>
  <div class="flex flex-row col items-center gap-2">
    <ButtonLink
      to="/invoices/add"
      variant="default"
      size="sm"
    >
      <Plus class="size-4" />
      {{ t('invoice.actions.create', 'Create Invoice') }}
    </ButtonLink>

    <div class="h-6 w-px bg-border mx-2" />

    <SendEmailAction
      :invoices="selectedRows"
      variant="button"
    />

    <SendToKsefAction
      :invoices="selectedRows"
      variant="button"
    />
  </div>
</template>
