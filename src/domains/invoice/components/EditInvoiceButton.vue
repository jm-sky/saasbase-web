<script setup lang="ts">
import { Pencil } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import ButtonLink from '@/components/ButtonLink.vue'
import type { IInvoice } from '../types/invoice.type'
import { useInvoiceStore } from '../stores/invoice.store'

const { t } = useI18n()

const invoiceStore = useInvoiceStore()

const { withText = false, withIcon = true } = defineProps<{
  invoice: IInvoice
  withIcon?: boolean
  withText?: boolean
}>()
</script>

<template>
  <ButtonLink
    v-tooltip="t('common.edit', 'Edit')"
    variant="outline"
    size="sm"
    :to="`/invoices/${invoice.id}/edit`"
    @click="invoiceStore.setInvoice(invoice)"
  >
    <template v-if="withIcon">
      <Pencil />
    </template>
    <template v-if="withText">
      {{ t('common.edit', 'Edit') }}
    </template>
  </ButtonLink>
</template>
