<script setup lang="ts">
import { Pencil, ScanEye } from 'lucide-vue-next'
import { useTemplateRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import ButtonLink from '@/components/ButtonLink.vue'
import EntityDetailsHeader from '@/components/layouts/EntityDetailsHeader.vue'
import Button from '@/components/ui/button/Button.vue'
import { toast } from '@/components/ui/toast'
import ExpenseAllocationPanel from '@/domains/expense/components/ExpenseAllocationPanel.vue'
import ExpenseApprovalPanel from '@/domains/expense/components/ExpenseApprovalPanel.vue'
import { useStartExpenseOcr } from '@/domains/expense/composables/useExpenseMutations'
import { useExpense } from '@/domains/expense/composables/useExpenseQueries'
import PaymentInfoDisplay from '@/domains/financial/components/PaymentInfoDisplay.vue'
import InvoiceLines from '@/domains/invoice/components/InvoiceLines.vue'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { toDateString } from '@/lib/toDateString'
import { setRouteTitle } from '@/router/helpers/setRouteTitle'
import ShowExpenseSidebar from './partials/ShowExpenseSidebar.vue'

const { t } = useI18n()
const route = useRoute()
const expenseId = route.params.id as string

const { data: expense, isPending: loading } = useExpense(expenseId)
const { mutateAsync: startExpenseOcr, isPending: ocrLoading } = useStartExpenseOcr()

const sidebar = useTemplateRef<typeof ShowExpenseSidebar>('sidebar')

watch(expense, (value) => {
  if (value?.number) setRouteTitle(route, value.number)
}, { immediate: true })

const startOcr = async () => {
  try {
    await startExpenseOcr({ id: expenseId })
    toast.success(t('financial.actions.startOcr.success'))
  } catch (err) {
    handleErrorWithToast(t('financial.actions.startOcr.error'), err)
  }
}
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
          :loading="ocrLoading"
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
          <ExpenseAllocationPanel
            :expense-id="expenseId"
            :total-gross="expense.totalGross"
            :currency="expense.currency"
            :status="expense.status"
          />
          <ExpenseApprovalPanel
            :expense-id="expenseId"
            :status="expense.status"
            :approval-status="expense.approvalStatus"
          />
          <PaymentInfoDisplay :payment="expense?.payment" />
        </div>
      </div>

      <!-- Sidebar -->
      <ShowExpenseSidebar ref="sidebar" :expense="expense" />
      <!-- End -->
    </div>
  </AuthenticatedLayout>
</template>
