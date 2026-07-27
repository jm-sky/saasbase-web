<script setup lang="ts">
import { RefreshCw } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ButtonLink from '@/components/ButtonLink.vue'
import DataListsWrapper from '@/components/DataLists/DataListsWrapper.vue'
import DataTable from '@/components/DataLists/DataTable.vue'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { usePendingExpenseApprovals } from '@/domains/expense/composables/useExpenseAllocationQueries'
import { useProcessExpenseApprovalDecision } from '@/domains/expense/composables/useExpenseMutations'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import { money } from '@/lib/money'
import type { IPendingExpenseApproval } from '@/domains/expense/types/expenseApproval.type'
import type { ColumnDef } from '@tanstack/vue-table'

const { t, locale } = useI18n()

const page = ref(1)
const perPage = ref(15)

const { data: response, isPending: loading, isError, refetch } = usePendingExpenseApprovals(page, perPage)
const { mutateAsync: processDecision, isPending: deciding } = useProcessExpenseApprovalDecision()

const items = computed(() => response.value?.data ?? [])
const total = computed(() => response.value?.meta.total ?? 0)
const error = computed(() => (isError.value ? t('expense.pendingApprovals.loadError') : null))

const columns: ColumnDef<IPendingExpenseApproval>[] = [
  { accessorKey: 'expenseNumber', header: () => t('financial.fields.number') },
  { accessorKey: 'expenseAmount', header: () => t('financial.fields.totalGross') },
  { accessorKey: 'currentStepName', header: () => t('expense.approval.currentStep') },
  { accessorKey: 'waitingTime', header: () => t('expense.pendingApprovals.waiting') },
  { id: 'actions', header: () => t('common.actions'), enableSorting: false },
]

const onDecision = async (expenseId: string, decision: 'approved' | 'rejected') => {
  try {
    await processDecision({ expenseId, decision })
    toast.success(
      decision === 'approved'
        ? t('expense.approval.approvedSuccess')
        : t('expense.approval.rejectedSuccess'),
    )
  } catch (err) {
    handleErrorWithToast(t('expense.approval.decisionError'), err)
  }
}
</script>

<template>
  <AuthenticatedLayout>
    <DataListsWrapper
      :title="t('expense.pendingApprovals.title')"
      :loading
      :error
    >
      <template #actions>
        <Button variant="ghost" @click="refetch()">
          <RefreshCw class="size-4" />
        </Button>
        <ButtonLink variant="outline" to="/expenses">
          {{ t('expense.title') }}
        </ButtonLink>
      </template>

      <DataTable
        v-model:page="page"
        v-model:page-size="perPage"
        :columns="columns"
        :data="items"
        :total="total"
        :page-size-options="[10, 15, 25, 50]"
        :loading
      >
        <template #expenseNumber="{ data }">
          <ButtonLink :to="`/expenses/${data.expenseId}/show`">
            {{ data.expenseNumber ?? data.expenseId }}
          </ButtonLink>
        </template>

        <template #expenseAmount="{ data }">
          <span v-if="data.expenseAmount != null">
            {{ money(data.expenseAmount, 'PLN', locale) }}
          </span>
          <span v-else>—</span>
        </template>

        <template #currentStepName="{ data }">
          {{ data.currentStepName ?? data.currentStep?.name ?? '—' }}
        </template>

        <template #waitingTime="{ data }">
          <span v-if="data.waitingTime != null">
            {{ t('expense.pendingApprovals.waitingHours', { count: Math.round(data.waitingTime) }) }}
          </span>
          <span v-else>—</span>
        </template>

        <template #actions="{ data }">
          <div class="flex flex-wrap gap-2 justify-end">
            <Button
              size="sm"
              variant="primary"
              :disabled="deciding"
              @click="onDecision(data.expenseId, 'approved')"
            >
              {{ t('expense.approval.approve') }}
            </Button>
            <Button
              size="sm"
              variant="outline"
              :disabled="deciding"
              @click="onDecision(data.expenseId, 'rejected')"
            >
              {{ t('expense.approval.reject') }}
            </Button>
          </div>
        </template>
      </DataTable>
    </DataListsWrapper>
  </AuthenticatedLayout>
</template>
