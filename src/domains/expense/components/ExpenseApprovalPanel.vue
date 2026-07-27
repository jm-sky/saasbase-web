<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from '@/components/ui/button/Button.vue'
import { toast } from '@/components/ui/toast'
import {
  useExpenseApproval,
  useExpenseCanApprove,
} from '@/domains/expense/composables/useExpenseAllocationQueries'
import {
  useProcessExpenseApprovalDecision,
  useStartExpenseApproval,
} from '@/domains/expense/composables/useExpenseMutations'
import { handleErrorWithToast } from '@/lib/handleErrorWithToast'
import type { TInvoiceStatus } from '@/domains/financial/types/financial.type'

const props = defineProps<{
  expenseId: string
  status: TInvoiceStatus
  approvalStatus?: string
}>()

const { t } = useI18n()

const { data: execution, isPending: loadingExecution } = useExpenseApproval(() => props.expenseId)
const { data: canApproveInfo } = useExpenseCanApprove(() => props.expenseId)
const { mutateAsync: startApproval, isPending: starting } = useStartExpenseApproval()
const { mutateAsync: processDecision, isPending: deciding } = useProcessExpenseApprovalDecision()

const canStartApproval = computed(() =>
  props.status === 'processing' && !execution.value?.isPending,
)

const showDecisionButtons = computed(() => canApproveInfo.value?.canApprove === true)

const onStartApproval = async () => {
  try {
    const result = await startApproval(props.expenseId)
    if ('autoApproved' in result) {
      toast.success(t('expense.approval.autoApproved'))
    } else {
      toast.success(t('expense.approval.startSuccess'))
    }
  } catch (error) {
    handleErrorWithToast(t('expense.approval.startError'), error)
  }
}

const onDecision = async (decision: 'approved' | 'rejected') => {
  try {
    await processDecision({ expenseId: props.expenseId, decision })
    toast.success(
      decision === 'approved'
        ? t('expense.approval.approvedSuccess')
        : t('expense.approval.rejectedSuccess'),
    )
  } catch (error) {
    handleErrorWithToast(t('expense.approval.decisionError'), error)
  }
}
</script>

<template>
  <section class="mt-6 border rounded-lg p-4 sm:p-6 shadow-sm bg-card">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
      <h2 class="text-lg font-semibold">
        {{ t('expense.approval.title') }}
      </h2>
      <Button
        v-if="canStartApproval"
        variant="primary"
        size="sm"
        :loading="starting"
        :disabled="deciding"
        @click="onStartApproval"
      >
        {{ t('expense.approval.start') }}
      </Button>
    </div>

    <div v-if="loadingExecution" class="text-sm text-muted-foreground">
      {{ t('common.loading') }}
    </div>

    <template v-else>
      <p v-if="approvalStatus" class="text-sm mb-2">
        <span class="text-muted-foreground">{{ t('expense.approval.documentStatus') }}:</span>
        {{ approvalStatus }}
      </p>

      <div v-if="execution" class="text-sm space-y-1 mb-4">
        <div>
          <span class="text-muted-foreground">{{ t('expense.approval.workflowStatus') }}:</span>
          {{ execution.statusLabel }}
        </div>
        <div v-if="execution.currentStep?.name">
          <span class="text-muted-foreground">{{ t('expense.approval.currentStep') }}:</span>
          {{ execution.currentStep.name }}
        </div>
      </div>

      <p v-else class="text-sm text-muted-foreground mb-4">
        {{ t('expense.approval.noWorkflow') }}
      </p>

      <div v-if="showDecisionButtons" class="flex flex-wrap gap-2">
        <Button
          variant="primary"
          size="sm"
          :loading="deciding"
          :disabled="starting"
          @click="onDecision('approved')"
        >
          {{ t('expense.approval.approve') }}
        </Button>
        <Button
          variant="outline"
          size="sm"
          :loading="deciding"
          :disabled="starting"
          @click="onDecision('rejected')"
        >
          {{ t('expense.approval.reject') }}
        </Button>
      </div>

      <p
        v-else-if="canApproveInfo?.reason && execution?.isPending"
        class="text-xs text-muted-foreground"
      >
        {{ canApproveInfo.reason }}
      </p>
    </template>
  </section>
</template>
