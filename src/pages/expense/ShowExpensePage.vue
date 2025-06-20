<script setup lang="ts">
import { RefreshCcw, Scan } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import Button from '@/components/ui/button/Button.vue'
import { useToast } from '@/components/ui/toast'
import ExpenseAttachmentsList from '@/domains/expense/components/attachments/ExpenseAttachmentsList.vue'
import { expenseService } from '@/domains/expense/services/expenseService'
import { useExpenseStore } from '@/domains/expense/stores/expense.store'
import InvoiceLines from '@/domains/invoice/components/InvoiceLines.vue'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { toDateString } from '@/lib/toDateString'
import ShowExpenseSidebar from './partials/ShowExpenseSidebar.vue'

const { t } = useI18n()
const { toast } = useToast()
const route = useRoute()
const expenseId = route.params.id as string

const expenseStore = useExpenseStore()
const { expense } = storeToRefs(expenseStore)

const loading = ref(false)
const error = ref<string | null>(null)

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
})
</script>

<template>
  <AuthenticatedLayout>
    <div class="px-4 md:px-6 py-4 md:py-6 flex flex-col gap-y-6" data-testid="entity-details-layout">
      <div class="flex flex-row gap-4 items-center justify-between">
        <div>
          <div class="font-bold">
            {{ t('expense.show.title') }}
          </div>
          <div class="text-sm text-muted-foreground">
            <RouterLink :to="'/expenses'">
              {{ t('expense.title') }}
            </RouterLink>
          </div>
        </div>
        <div class="flex flex-row items-center justify-end gap-2">
          <Button
            v-tooltip="t('financial.actions.startOcr.tooltip')"
            variant="ghost"
            :loading
            @click="startOcr"
          >
            <Scan class="size-4" />
          </Button>
          <Button
            v-tooltip="t('common.refresh')"
            variant="ghost"
            :loading
            @click="refresh"
          >
            <RefreshCcw class="size-4" />
          </Button>
        </div>
      </div>

      <div class="p-8 flex flex-col gap-4 border rounded shadow-lg bg-white dark:bg-gray-800">
        <div class="grid grid-cols-1 lg:grid-cols-[1fr_29rem] gap-16">
          <!-- Main content -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="col-span-2 mb-6">
              <h1 class="text-xl font-bold">
                {{ t(`financial.invoiceType.${expense?.type}`) }}
              </h1>
              <h2 class="text-2xl font-bold">
                {{ expense?.number }}
              </h2>
            </div>

            <div>
              <div class="text-sm text-muted-foreground">
                {{ t('financial.fields.issueDate') }}
              </div>
              <div class="font-semibold">
                {{ expense?.issueDate ? toDateString(expense?.issueDate) : 'N/A' }}
              </div>
            </div>
            <div>
              <div class="text-sm text-muted-foreground">
                {{ t('financial.fields.dueDate') }}
              </div>
              <div class="font-semibold">
                {{ expense?.payment?.dueDate ? toDateString(expense?.payment?.dueDate) : 'N/A' }}
              </div>
            </div>

            <div>
              <div class="text-sm text-muted-foreground">
                Issued for
              </div>
              <div class="font-semibold">
                {{ expense?.buyer?.name ?? '-' }}
              </div>
              <div class="text-sm text-muted-foreground">
                {{ expense?.buyer?.address ?? '-' }}
              </div>
            </div>

            <div>
              <div class="text-sm text-muted-foreground">
                Issued by
              </div>
              <div class="font-semibold">
                {{ expense?.seller?.name ?? '-' }}
              </div>
              <div class="text-sm text-muted-foreground">
                {{ expense?.seller?.address ?? '-' }}
              </div>
            </div>

            <InvoiceLines
              v-if="expense?.body.lines"
              :lines="expense?.body.lines"
              :currency="expense?.currency"
              :total-net="expense?.totalNet"
              :total-tax="expense?.totalTax"
              :total-gross="expense?.totalGross"
            />
          </div>

          <!-- Sidebar -->
          <div class="flex flex-col gap-4">
            <ShowExpenseSidebar :expense />
            <ExpenseAttachmentsList
              :expense-id="expense?.id"
              class="border rounded-md py-2 px-4"
            />
          </div>

          <!-- End -->
        </div>
      </div>
    </div>
  </AuthenticatedLayout>
</template>
