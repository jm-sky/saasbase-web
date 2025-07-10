<script setup lang="ts">
import { templateRef } from '@vueuse/core'
import { Pencil } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import ButtonLink from '@/components/ButtonLink.vue'
import EntityDetailsHeader from '@/components/layouts/EntityDetailsHeader.vue'
import PaymentInfoDisplay from '@/domains/financial/components/PaymentInfoDisplay.vue'
import GeneratePdfAction from '@/domains/invoice/components/actions/GeneratePdfAction.vue'
import InvoiceLines from '@/domains/invoice/components/InvoiceLines.vue'
import { invoiceService } from '@/domains/invoice/services/invoiceService'
import { useInvoiceStore } from '@/domains/invoice/stores/invoice.store'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { toDateString } from '@/lib/toDateString'
import { setRouteTitle } from '@/router/helpers/setRouteTitle'
import ShowInvoiceSidebar from './partials/ShowInvoiceSidebar.vue'

const { t } = useI18n()
const route = useRoute()
const invoiceId = route.params.id as string

const invoiceStore = useInvoiceStore()
const { invoice } = storeToRefs(invoiceStore)

const loading = ref(false)
const error = ref<string | null>(null)

const sidebar = templateRef<typeof ShowInvoiceSidebar>('sidebar')

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
  setRouteTitle(route, invoice.value?.number)
})
</script>

<template>
  <AuthenticatedLayout>
    <EntityDetailsHeader
      :title="t('invoice.show.title')"
      :back-link-text="t('invoice.title')"
      back-link="/invoices"
      padded
    >
      <template #actions-left>
        <GeneratePdfAction
          :invoice="invoice"
          variant="button"
          @done="[sidebar?.attachments?.refresh(), refresh()]"
        />

        <ButtonLink
          v-if="invoice"
          v-tooltip.bottom.focus="t('common.edit')"
          variant="primary"
          size="sm"
          :to="`/invoices/${invoiceId}/edit`"
          :disabled="loading"
        >
          <Pencil class="size-4" />
        </ButtonLink>
      </template>
    </EntityDetailsHeader>

    <div class="flex flex-row gap-8 lg:mx-6 mb-10">
      <div class="w-full lg:w-7xl max-w-7xl mx-auto p-2 sm:p-4 md:p-8 border shadow-xl/30">
        <!-- Main content -->
        <div class="grid grid-cols-1 lg:grid-cols-[2fr_1fr]">
          <div class="border-b border-r p-2 sm:p-4 md:p-6">
            <div class="text-5xl font-bold py-4 mb-2">
              {{ t(`financial.invoiceType.${invoice?.type}`) }}
            </div>
            <div class="flex flex-col sm:flex-row items-center justify-between gap-4 border-b-6 border-primary px-2 sm:px-4 py-2 font-semibold text-muted-foreground">
              <div class="text-xl font-bold">
                {{ invoice?.number }}
              </div>
              <div class="text-lg">
                {{ invoice?.issueDate ? toDateString(invoice?.issueDate) : 'N/A' }}
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <div class="text-sm text-muted-foreground mb-2">
                  {{ t('financial.fields.issueDate') }}
                </div>
                <div class="font-semibold">
                  {{ invoice?.issueDate ? toDateString(invoice?.issueDate) : 'N/A' }}
                </div>
              </div>
              <div>
                <div class="text-sm text-muted-foreground mb-2">
                  {{ t('financial.fields.dueDate') }}
                </div>
                <div class="font-semibold">
                  {{ invoice?.payment?.dueDate ? toDateString(invoice?.payment?.dueDate) : 'N/A' }}
                </div>
              </div>
            </div>
          </div>

          <div class="border-b p-2 sm:p-4 md:p-6">
            <div class="text-sm text-muted-foreground mb-2">
              {{ t('financial.fields.issuedBy') }}
            </div>
            <div class="font-semibold text-lg">
              {{ invoice?.seller?.name }}
            </div>
            <div class="text-sm text-muted-foreground mt-1">
              {{ invoice?.seller?.address }}
            </div>
            <div class="text-sm text-muted-foreground">
              {{ t('financial.fields.taxId') }}: {{ invoice?.seller?.taxId ?? '-' }}
            </div>
            <div v-if="invoice?.seller?.email" class="text-sm text-muted-foreground">
              Email: {{ invoice?.seller?.email }}
            </div>
          </div>

          <div class="border-r p-2 sm:p-4 md:p-6">
            <div class="text-muted-foreground text-sm mb-2">
              Terms & Notes
            </div>
            <div v-if="invoice?.payment?.terms" class="text-sm">
              {{ invoice?.payment?.terms }}
            </div>
            <div v-else class="text-muted-foreground text-sm">
              No additional terms
            </div>
          </div>

          <div class="p-2 sm:p-4 md:p-6">
            <div class="text-sm text-muted-foreground mb-2">
              {{ t('financial.fields.issuedFor') }}
            </div>
            <div class="font-semibold text-lg">
              {{ invoice?.buyer?.name }}
            </div>
            <div class="text-sm text-muted-foreground mt-1">
              {{ invoice?.buyer?.address }}
            </div>
            <div class="text-sm text-muted-foreground">
              {{ t('financial.fields.taxId') }}: {{ invoice?.buyer?.taxId ?? '-' }}
            </div>
            <div v-if="invoice?.buyer?.email" class="text-sm text-muted-foreground">
              Email: {{ invoice?.buyer?.email }}
            </div>
          </div>
        </div>

        <InvoiceLines
          v-if="invoice?.body.lines"
          :lines="invoice?.body.lines"
          :currency="invoice?.currency"
          :total-net="invoice?.totalNet"
          :total-tax="invoice?.totalTax"
          :total-gross="invoice?.totalGross"
          class="mt-8"
        />

        <!-- Payment Information Section -->
        <div v-if="invoice" class="mt-8">
          <PaymentInfoDisplay :payment="invoice?.payment" />
        </div>
      </div>

      <!-- Sidebar -->
      <ShowInvoiceSidebar ref="sidebar" :invoice="invoice" />
      <!-- End -->
    </div>
  </AuthenticatedLayout>
</template>
