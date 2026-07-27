<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from '@/components/ui/button/Button.vue'
import { toast } from '@/components/ui/toast'
import ExpenseAllocationFormModal from '@/domains/expense/components/ExpenseAllocationFormModal.vue'
import { useExpenseAllocations } from '@/domains/expense/composables/useExpenseAllocationQueries'
import {
  useAutoAllocateExpense,
  useClearExpenseAllocations,
} from '@/domains/expense/composables/useExpenseMutations'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import type { TInvoiceStatus } from '@/domains/financial/types/financial.type'

const props = defineProps<{
  expenseId: string
  totalGross: number
  currency: string
  status: TInvoiceStatus
}>()

const { t } = useI18n()
const formOpen = ref(false)

const { data: allocations, isPending, isError, refetch } = useExpenseAllocations(() => props.expenseId)
const { mutateAsync: autoAllocate, isPending: autoAllocating } = useAutoAllocateExpense()
const { mutateAsync: clearAllocations, isPending: clearing } = useClearExpenseAllocations()

const canAllocate = computed(() => props.status === 'draft' || props.status === 'processing')

const totalAllocated = computed(() =>
  (allocations.value ?? []).reduce((sum, row) => sum + row.amount, 0),
)

const remaining = computed(() => Math.max(0, props.totalGross - totalAllocated.value))

const formatMoney = (value: number) =>
  new Intl.NumberFormat(undefined, { style: 'currency', currency: props.currency || 'PLN' }).format(value)

const onAutoAllocate = async () => {
  try {
    await autoAllocate(props.expenseId)
    toast.success(t('expense.allocation.autoSuccess'))
  } catch (error) {
    handleErrorWithToast(t('expense.allocation.autoError'), error)
  }
}

const onClear = async () => {
  try {
    await clearAllocations(props.expenseId)
    toast.success(t('expense.allocation.clearSuccess'))
  } catch (error) {
    handleErrorWithToast(t('expense.allocation.clearError'), error)
  }
}
</script>

<template>
  <section class="mt-8 border rounded-lg p-4 sm:p-6 shadow-sm bg-card">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
      <h2 class="text-lg font-semibold">
        {{ t('expense.allocation.title') }}
      </h2>
      <div class="flex flex-wrap gap-2">
        <Button
          variant="primary"
          size="sm"
          :disabled="!canAllocate || autoAllocating || clearing"
          @click="formOpen = true"
        >
          {{ t('expense.allocation.manual') }}
        </Button>
        <Button
          variant="outline"
          size="sm"
          :disabled="!canAllocate || autoAllocating || clearing"
          :loading="autoAllocating"
          @click="onAutoAllocate"
        >
          {{ t('expense.allocation.auto') }}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          :disabled="!allocations?.length || clearing || autoAllocating"
          :loading="clearing"
          @click="onClear"
        >
          {{ t('expense.allocation.clear') }}
        </Button>
        <Button
          v-if="isError"
          variant="ghost"
          size="sm"
          @click="refetch()"
        >
          {{ t('common.refresh') }}
        </Button>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm mb-4">
      <div>
        <span class="text-muted-foreground">{{ t('expense.allocation.expenseTotal') }}</span>
        <div class="font-medium">
          {{ formatMoney(totalGross) }}
        </div>
      </div>
      <div>
        <span class="text-muted-foreground">{{ t('expense.allocation.allocated') }}</span>
        <div class="font-medium">
          {{ formatMoney(totalAllocated) }}
        </div>
      </div>
      <div>
        <span class="text-muted-foreground">{{ t('expense.allocation.remaining') }}</span>
        <div class="font-medium">
          {{ formatMoney(remaining) }}
        </div>
      </div>
    </div>

    <div v-if="isPending" class="text-sm text-muted-foreground">
      {{ t('common.loading') }}
    </div>

    <div v-else-if="!allocations?.length" class="text-sm text-muted-foreground">
      {{ t('expense.allocation.empty') }}
    </div>

    <ul v-else class="divide-y rounded-md border">
      <li
        v-for="row in allocations"
        :key="row.id"
        class="px-3 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1"
      >
        <div>
          <div class="font-medium">
            {{ formatMoney(row.amount) }}
          </div>
          <div v-if="row.note" class="text-xs text-muted-foreground">
            {{ row.note }}
          </div>
          <div
            v-for="dim in row.dimensions ?? []"
            :key="dim.id"
            class="text-xs text-muted-foreground"
          >
            {{ dim.dimensionTypeLabel }}:
            {{ dim.dimensionEntity?.name ?? dim.dimensionEntity?.code ?? dim.dimensionId }}
          </div>
        </div>
        <div class="text-xs text-muted-foreground">
          {{ row.statusLabel }}
        </div>
      </li>
    </ul>

    <p v-if="!canAllocate" class="text-xs text-muted-foreground mt-3">
      {{ t('expense.allocation.lockedHint') }}
    </p>

    <ExpenseAllocationFormModal
      v-model:open="formOpen"
      :expense-id="expenseId"
      :total-gross="totalGross"
      :currency="currency"
    />
  </section>
</template>
