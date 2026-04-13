<script setup lang="ts">
import { Pencil, ScanEye } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { onMounted, ref, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import ButtonLink from '@/components/ButtonLink.vue'
import EntityDetailsHeader from '@/components/layouts/EntityDetailsHeader.vue'
import Button from '@/components/ui/button/Button.vue'
import { useToast } from '@/components/ui/toast'
import { expenseService } from '@/domains/expense/services/expenseService'
import { useExpenseStore } from '@/domains/expense/stores/expense.store'
import PaymentInfoDisplay from '@/domains/financial/components/PaymentInfoDisplay.vue'
import InvoiceLines from '@/domains/invoice/components/InvoiceLines.vue'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { toDateString } from '@/lib/toDateString'
import { setRouteTitle } from '@/router/helpers/setRouteTitle'
import ShowExpenseSidebar from './partials/ShowExpenseSidebar.vue'

const { t } = useI18n()
const { toast } = useToast()
const route = useRoute()
const expenseId = route.params.id as string

const expenseStore = useExpenseStore()
const { expense } = storeToRefs(expenseStore)

const loading = ref(false)
const error = ref<string | null>(null)

const sidebar = useTemplateRef<typeof ShowExpenseSidebar>('sidebar')

const refresh = async () => {
  try {
    loading.value = true
    error.value = null
    expense.value = await expenseService.get(expenseId)
  } catch (err) {
    handleErrorWithToast(t('expense.show.error', 'Error'), err)
    error.value = 'Failed to load expense'
  } finally {
    loading.value = false
  }
}

const startOcr = async () => {
  try {
    await expenseService.startOcr(expenseId)
    toast.success(t('financial.actions.startOcr.success'))
  } catch (err) {
    handleErrorWithToast(t('financial.actions.startOcr.error'), err)
  }
}

onMounted(async () => {
  await refresh()
  setRouteTitle(route, expense.value?.number)
})
</script>

<template>
  <AuthenticatedLayout>
    <EntityDetailsHeader
      :title="t('expense.show.title')"
      :back-link-text="t('expense.title')"
      back-link="/expenses"
      padded
    >
      <template #actions-left>
        <Button
          v-tooltip="t('financial.actions.startOcr.tooltip')"
          variant="ghost"
          :loading
          @click="startOcr"
        >
          <ScanEye class="size-4" />
        </Button>

        <ButtonLink
          v-if="expense"
          v-tooltip.bottom.focus="t('common.edit')"
          variant="primary"
          size="sm"
          :to="`/expenses/${expenseId}/edit`"
          :disabled="loading"
        >
          <Pencil class="size-4" />
        </ButtonLink>
      </template>
    </EntityDetailsHeader>

    <div class="flex flex-col md:flex-row gap-8 lg:mx-6 mb-10">
      <div class="w-full lg:w-7xl max-w-7xl mx-auto p-2 sm:p-4 md:p-8 border shadow-xl/30">
        <!-- Main content -->
        <div class="grid grid-cols-1 lg:grid-cols-[2fr_1fr]">
          <div class="border-b border-r p-2 sm:p-4 md:p-6">
            <div class="text-5xl font-bold py-4 mb-2">
              {{ t(`financial.invoiceType.${expense?.type}`) }}
            </div>
            <div class="flex flex-col sm:flex-row items-center justify-between gap-4 border-b-6 border-primary px-2 sm:px-4 py-2 font-semibold text-muted-foreground">
              <div class="text-xl font-bold">
                {{ expense?.number }}
              </div>
              <div class="text-lg">
                {{ expense?.issueDate ? toDateString(expense?.issueDate) : 'N/A' }}
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <div class="text-sm text-muted-foreground mb-2">
                  {{ t('financial.fields.issueDate') }}
                </div>
                <div class="font-semibold">
                  {{ expense?.issueDate ? toDateString(expense?.issueDate) : 'N/A' }}
                </div>
              </div>
              <div>
                <div class="text-sm text-muted-foreground mb-2">
                  {{ t('financial.fields.dueDate') }}
                </div>
                <div class="font-semibold">
                  {{ expense?.payment?.dueDate ? toDateString(expense?.payment?.dueDate) : 'N/A' }}
                </div>
              </div>
            </div>
          </div>

          <div class="border-b p-2 sm:p-4 md:p-6">
            <div class="text-sm text-muted-foreground mb-2">
              {{ t('financial.fields.issuedBy') }}
            </div>
            <div class="font-semibold text-lg">
              {{ expense?.seller?.name }}
            </div>
            <div class="text-sm text-muted-foreground mt-1">
              {{ expense?.seller?.address }}
            </div>
            <div class="text-sm text-muted-foreground">
              {{ t('financial.fields.taxId') }}: {{ expense?.seller?.taxId ?? '-' }}
            </div>
            <div v-if="expense?.seller?.email" class="text-sm text-muted-foreground">
              Email: {{ expense?.seller?.email }}
            </div>
          </div>

          <div class="border-r p-2 sm:p-4 md:p-6">
            <div class="text-muted-foreground text-sm mb-2">
              Terms & Notes
            </div>
            <div v-if="expense?.payment?.terms" class="text-sm">
              {{ expense?.payment?.terms }}
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
              {{ expense?.buyer?.name }}
            </div>
            <div class="text-sm text-muted-foreground mt-1">
              {{ expense?.buyer?.address }}
            </div>
            <div class="text-sm text-muted-foreground">
              {{ t('financial.fields.taxId') }}: {{ expense?.buyer?.taxId ?? '-' }}
            </div>
            <div v-if="expense?.buyer?.email" class="text-sm text-muted-foreground">
              Email: {{ expense?.buyer?.email }}
            </div>
          </div>
        </div>

        <InvoiceLines
          v-if="expense?.body.lines"
          :lines="expense?.body.lines"
          :currency="expense?.currency"
          :total-net="expense?.totalNet"
          :total-tax="expense?.totalTax"
          :total-gross="expense?.totalGross"
          class="mt-8"
        />

        <!-- Payment Information Section -->
        <div v-if="expense" class="mt-8">
          <PaymentInfoDisplay :payment="expense?.payment" />
        </div>
      </div>

      <!-- Sidebar -->
      <ShowExpenseSidebar ref="sidebar" :expense="expense" />
      <!-- End -->
    </div>
  </AuthenticatedLayout>
</template>
