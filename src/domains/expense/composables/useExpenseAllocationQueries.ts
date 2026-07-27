import { useQuery } from '@tanstack/vue-query'
import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import { expenseAllocationService } from '../services/expenseAllocationService'
import { expenseApprovalService } from '../services/expenseApprovalService'
import { expenseDimensionService } from '../services/expenseDimensionService'
import { expenseKeys } from './queryKeys'

export function useExpenseAllocations(expenseId: MaybeRefOrGetter<string | undefined>) {
  return useQuery({
    queryKey: computed(() => expenseKeys.allocations(toValue(expenseId) ?? '')),
    queryFn: () => {
      const id = toValue(expenseId)
      if (!id) throw new Error('Expense id is required')
      return expenseAllocationService.list(id)
    },
    enabled: computed(() => Boolean(toValue(expenseId))),
  })
}

export function useExpenseApproval(expenseId: MaybeRefOrGetter<string | undefined>) {
  return useQuery({
    queryKey: computed(() => expenseKeys.approval(toValue(expenseId) ?? '')),
    queryFn: () => {
      const id = toValue(expenseId)
      if (!id) throw new Error('Expense id is required')
      return expenseApprovalService.getExecution(id)
    },
    enabled: computed(() => Boolean(toValue(expenseId))),
  })
}

export function useExpenseCanApprove(expenseId: MaybeRefOrGetter<string | undefined>) {
  return useQuery({
    queryKey: computed(() => expenseKeys.canApprove(toValue(expenseId) ?? '')),
    queryFn: () => {
      const id = toValue(expenseId)
      if (!id) throw new Error('Expense id is required')
      return expenseApprovalService.canApprove(id)
    },
    enabled: computed(() => Boolean(toValue(expenseId))),
  })
}

export function useAvailableAllocationDimensions(enabled: MaybeRefOrGetter<boolean> = true) {
  return useQuery({
    queryKey: expenseKeys.allocationDimensions(),
    queryFn: () => expenseDimensionService.getAvailableDimensions(),
    enabled: computed(() => toValue(enabled)),
    staleTime: 60_000,
  })
}

export function usePendingExpenseApprovals(
  page: MaybeRefOrGetter<number>,
  perPage: MaybeRefOrGetter<number> = 15,
) {
  return useQuery({
    queryKey: computed(() => expenseKeys.pendingApprovals(toValue(page), toValue(perPage))),
    queryFn: () => expenseApprovalService.listPending(toValue(page), toValue(perPage)),
    placeholderData: previousData => previousData,
  })
}
