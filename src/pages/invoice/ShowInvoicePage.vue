<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import EntityDetailsLayout from '@/components/layouts/EntityDetailsLayout.vue'
import { invoiceService } from '@/domains/invoice/services/invoiceService'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { toDateTimeString } from '@/lib/toDateTimeString'
import type { IInvoice } from '@/domains/invoice/types/invoice.type'

const { t } = useI18n()
const route = useRoute()
const invoiceId = route.params.id as string

const invoice = ref<IInvoice>()
const loading = ref(false)
const error = ref<string | null>(null)

const refresh = async () => {
  try {
    loading.value = true
    error.value = null
    invoice.value = await invoiceService.get(invoiceId)
  } catch (err) {
    handleErrorWithToast(t('invoice.show.error', 'Error'), err)
    error.value = 'Failed to load invoice'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await refresh()
})
</script>

<template>
  <AuthenticatedLayout>
    <EntityDetailsLayout
      v-if="invoice"
      :title="t('invoice.invoiceDetails', 'Invoice Details')"
      :back-link="'/invoices'"
      :edit-link="`/invoices/${invoiceId}/edit`"
      :name="invoice.number"
      :loading="loading"
      @refresh="refresh"
    >
      <template #back-link-text>
        {{ t('invoice.title', 'Invoices') }}
      </template>
      <template #content>
        <div class="space-y-2">
          <div><strong>{{ t('invoice.fields.number', 'Number') }}:</strong> {{ invoice.number }}</div>
          <div><strong>{{ t('invoice.fields.type', 'Type') }}:</strong> {{ invoice.type }}</div>
          <div><strong>{{ t('invoice.fields.status', 'Status') }}:</strong> {{ invoice.status }}</div>
          <div><strong>{{ t('invoice.fields.totalGross', 'Total Gross') }}:</strong> {{ invoice.totalGross.toFixed(2) }} {{ invoice.currency }}</div>
          <div><strong>{{ t('invoice.fields.createdAt', 'Created At') }}:</strong> {{ invoice.createdAt ? toDateTimeString(invoice.createdAt) : '-' }}</div>
        </div>
      </template>
    </EntityDetailsLayout>
  </AuthenticatedLayout>
</template>
