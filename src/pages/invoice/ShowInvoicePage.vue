<script setup lang="ts">
import { RefreshCcw } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import Badge from '@/components/ui/badge/Badge.vue'
import Button from '@/components/ui/button/Button.vue'
import Separator from '@/components/ui/separator/Separator.vue'
import { invoiceService } from '@/domains/invoice/services/invoiceService'
import { useInvoiceStore } from '@/domains/invoice/stores/invoice.store'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { toDateString } from '@/lib/toDateString'
import type { BadgeVariants } from '@/components/ui/badge'

const { t } = useI18n()
const route = useRoute()
const invoiceId = route.params.id as string

const invoiceStore = useInvoiceStore()
const { invoice } = storeToRefs(invoiceStore)

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

const getStatusBadgeVariant = (status?: string): BadgeVariants['variant'] => {
  if (status === 'draft') return 'outline'
  if (status === 'paid') return 'success'
  if (status === 'partiallyPaid') return 'secondary'
  if (status === 'overdue') return 'destructive-outline'
  if (status === 'cancelled') return 'outline'
  return 'outline'
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

      <div class="p-8 flex flex-col gap-4 border rounded shadow-lg bg-white dark:bg-gray-800">
        <div class="grid grid-cols-[1fr_29rem] gap-16">
          <!-- Main content -->
          <div class="grid grid-cols-2 gap-8">
            <div class="col-span-2 mb-6">
              <h1 class="text-xl font-bold">
                {{ t(`invoice.type.${invoice?.type}`) }}
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
            </div>

            <div class="col-span-2">
              <table class="w-full text-sm">
                <thead>
                  <tr>
                    <th class="text-sm p-2 text-muted-foreground border-b text-left ">
                      Description
                    </th>
                    <th class="text-sm p-2 text-muted-foreground border-b text-end">
                      Quantity
                    </th>
                    <th class="text-sm p-2 text-muted-foreground border-b text-end">
                      Unit price
                    </th>
                    <th class="text-sm p-2 text-muted-foreground border-b text-end">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in invoice?.body.lines" :key="item.id">
                    <td class="p-2">
                      {{ item.description }}
                    </td>
                    <td class="p-2 text-end">
                      {{ item.quantity.toFixed(2) }}
                    </td>
                    <td class="p-2 text-end">
                      {{ item.unitPrice.toFixed(2) }}
                    </td>
                    <td class="p-2 text-end font-semibold">
                      {{ item.totalGross.toFixed(2) }}
                      {{ invoice?.currency }}
                    </td>
                  </tr>
                </tbody>
              </table>

              <Separator class="my-2" />

              <div class="ml-auto w-1/2 grid grid-cols-2 items-center gap-3 text-sm text-end pe-2">
                <div class="text-muted-foreground text-end">
                  {{ t(`invoice.fields.totalNet`) }}:
                </div>
                <div class="font-bold">
                  {{ invoice?.totalNet?.toFixed(2) }} {{ invoice?.currency }}
                </div>
                <div class="text-muted-foreground text-end">
                  {{ t(`invoice.fields.totalTax`) }}:
                </div>
                <div class="font-bold">
                  {{ invoice?.totalTax?.toFixed(2) }} {{ invoice?.currency }}
                </div>
                <div class="text-muted-foreground text-end">
                  {{ t(`invoice.fields.totalGross`) }}:
                </div>
                <div class="font-bold">
                  {{ invoice?.totalGross?.toFixed(2) }} {{ invoice?.currency }}
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="flex flex-col gap-4 border border-dashed rounded-lg p-8">
            <div class="flex flex-row gap-2 mb-2">
              <Badge :variant="getStatusBadgeVariant(invoice?.status)">
                {{ t(`invoice.status.${invoice?.status}`) }}
              </Badge>
            </div>

            <div class="uppercase text-sm font-bold text-muted-foreground">
              Payment
            </div>
            <div class="flex flex-col gap-4">
              <div>
                <div class="text-sm text-muted-foreground">
                  Method
                </div>
                <div class="font-semibold">
                  {{ invoice?.payment?.method }}
                </div>
              </div>

              <div>
                <div class="text-sm text-muted-foreground">
                  Status
                </div>
                <div class="font-semibold">
                  {{ t(`invoice.paymentStatus.${invoice?.payment?.status}`) }}
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
            </div>
          </div>
          <!-- End -->
        </div>
      </div>
    </div>
  </AuthenticatedLayout>
</template>
