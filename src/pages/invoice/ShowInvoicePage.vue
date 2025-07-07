<script setup lang="ts">
import { templateRef } from '@vueuse/core'
import { RefreshCcw } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import Button from '@/components/ui/button/Button.vue'
import GeneratePdfAction from '@/domains/invoice/components/actions/GeneratePdfAction.vue'
import InvoiceLines from '@/domains/invoice/components/InvoiceLines.vue'
import { invoiceService } from '@/domains/invoice/services/invoiceService'
import { useInvoiceStore } from '@/domains/invoice/stores/invoice.store'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { toDateString } from '@/lib/toDateString'
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
})
</script>

<template>
  <AuthenticatedLayout>
    <div class="px-4 md:px-6 py-4 md:py-6 flex flex-col gap-y-6" data-testid="entity-details-layout">
      <div class="flex flex-row gap-4 items-center justify-between">
        <div>
          <div class="font-bold">
            {{ t('invoice.show.title') }}
          </div>
          <div class="text-sm text-muted-foreground">
            <RouterLink :to="'/invoices'">
              {{ t('invoice.title') }}
            </RouterLink>
          </div>
        </div>
        <div class="flex flex-row items-center justify-end gap-2">
          <GeneratePdfAction
            :invoice="invoice"
            variant="button"
            @done="sidebar?.attachments?.refresh()"
          />

          <Button
            v-tooltip.bottom.focus="t('common.refresh')"
            variant="ghost"
            :loading
            @click="refresh"
          >
            <RefreshCcw class="size-4" />
          </Button>
        </div>
      </div>
    </div>

    <div class="flex flex-row gap-8 m-6">
      <div class="w-full lg:w-7xl max-w-7xl mx-auto p-6 md:p-8 border shadow-xl/30">
        <!-- Main content -->
        <div class="grid grid-cols-2 gap-8 p-4">
          <div class="col-span-2 mb-6">
            <h1 class="text-xl font-bold">
              {{ t(`financial.invoiceType.${invoice?.type}`) }}
            </h1>
            <h2 class="text-2xl font-bold">
              {{ invoice?.number }}
            </h2>
          </div>

          <div>
            <div class="text-sm text-muted-foreground">
              Issue date
            </div>
            <div class="font-semibold">
              {{ invoice?.issueDate ? toDateString(invoice?.issueDate) : 'N/A' }}
            </div>
          </div>
          <div>
            <div class="text-sm text-muted-foreground">
              Due date
            </div>
            <div class="font-semibold">
              {{ invoice?.payment?.dueDate ? toDateString(invoice?.payment?.dueDate) : 'N/A' }}
            </div>
          </div>

          <div>
            <div class="text-sm text-muted-foreground">
              Issued for
            </div>
            <div class="font-semibold">
              {{ invoice?.buyer?.name }}
            </div>
            <div class="text-sm text-muted-foreground">
              {{ invoice?.buyer?.address }}
            </div>
            <div class="text-sm text-muted-foreground">
              {{ t('financial.fields.taxId') }}: {{ invoice?.buyer?.taxId ?? '-' }}
            </div>
          </div>

          <div>
            <div class="text-sm text-muted-foreground">
              Issued by
            </div>
            <div class="font-semibold">
              {{ invoice?.seller?.name }}
            </div>
            <div class="text-sm text-muted-foreground">
              {{ invoice?.seller?.address }}
            </div>
            <div class="text-sm text-muted-foreground">
              {{ t('financial.fields.taxId') }}: {{ invoice?.seller?.taxId ?? '-' }}
            </div>
          </div>

          <InvoiceLines
            v-if="invoice?.body.lines"
            :lines="invoice?.body.lines"
            :currency="invoice?.currency"
            :total-net="invoice?.totalNet"
            :total-tax="invoice?.totalTax"
            :total-gross="invoice?.totalGross"
          />
        </div>
      </div>

      <!-- Sidebar -->
      <ShowInvoiceSidebar ref="sidebar" :invoice="invoice" />
      <!-- End -->
    </div>
  </AuthenticatedLayout>
</template>
