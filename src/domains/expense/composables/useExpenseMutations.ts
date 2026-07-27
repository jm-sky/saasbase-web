import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { expenseAllocationService } from '../services/expenseAllocationService'
import { expenseApprovalService } from '../services/expenseApprovalService'
import { expenseService, type IUploadForOcr } from '../services/expenseService'
import { expenseKeys } from './queryKeys'
import type { IExpense, IExpenseCreate } from '../types/expense.type'
import type { TApprovalDecision } from '../types/expenseApproval.type'
import type { IExpenseAllocationLinePayload } from '../types/expenseDimension.type'
import type { TUUID } from '@/domains/shared/types/common'

function invalidatePendingApprovals(queryClient: ReturnType<typeof useQueryClient>) {
  void queryClient.invalidateQueries({ queryKey: [...expenseKeys.all, 'pending-approvals'] })
}

function invalidateExpenseWorkflow(queryClient: ReturnType<typeof useQueryClient>, expenseId: string) {
  void queryClient.invalidateQueries({ queryKey: expenseKeys.detail(expenseId) })
  void queryClient.invalidateQueries({ queryKey: expenseKeys.allocations(expenseId) })
  void queryClient.invalidateQueries({ queryKey: expenseKeys.approval(expenseId) })
  void queryClient.invalidateQueries({ queryKey: expenseKeys.canApprove(expenseId) })
  void queryClient.invalidateQueries({ queryKey: expenseKeys.lists() })
}

export function useCreateExpense() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: IExpenseCreate) => expenseService.create(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: expenseKeys.lists() })
    },
  })
}

export function useUpdateExpense() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<IExpense> }) => expenseService.update(id, data),
    onSuccess: (_result, { id }) => {
      void queryClient.invalidateQueries({ queryKey: expenseKeys.lists() })
      void queryClient.invalidateQueries({ queryKey: expenseKeys.detail(id) })
    },
  })
}

export function useDeleteExpense() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => expenseService.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: expenseKeys.lists() })
    },
  })
}

export function useUploadExpensesForOcr() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (values: IUploadForOcr) => expenseService.uploadForOcr(values),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: expenseKeys.lists() })
    },
  })
}

export function useStartExpenseOcr() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, mediaId }: { id: string, mediaId?: TUUID }) => expenseService.startOcr(id, mediaId),
    onSuccess: (_result, { id }) => {
      void queryClient.invalidateQueries({ queryKey: expenseKeys.detail(id) })
      void queryClient.invalidateQueries({ queryKey: expenseKeys.lists() })
    },
  })
}

export function useAutoAllocateExpense() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (expenseId: string) => expenseAllocationService.autoAllocate(expenseId),
    onSuccess: (_result, expenseId) => {
      invalidateExpenseWorkflow(queryClient, expenseId)
    },
  })
}

export function useClearExpenseAllocations() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (expenseId: string) => expenseAllocationService.clear(expenseId),
    onSuccess: (_result, expenseId) => {
      invalidateExpenseWorkflow(queryClient, expenseId)
    },
  })
}

export function useStoreExpenseAllocations() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      expenseId,
      allocations,
    }: {
      expenseId: string
      allocations: IExpenseAllocationLinePayload[]
    }) => expenseAllocationService.store(expenseId, allocations),
    onSuccess: (_result, { expenseId }) => {
      invalidateExpenseWorkflow(queryClient, expenseId)
    },
  })
}

export function useStartExpenseApproval() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (expenseId: string) => expenseApprovalService.start(expenseId),
    onSuccess: (_result, expenseId) => {
      invalidateExpenseWorkflow(queryClient, expenseId)
    },
  })
}

export function useProcessExpenseApprovalDecision() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      expenseId,
      decision,
      reason,
    }: {
      expenseId: string
      decision: TApprovalDecision
      reason?: string
    }) => expenseApprovalService.processDecision(expenseId, decision, reason),
    onSuccess: (_result, { expenseId }) => {
      invalidateExpenseWorkflow(queryClient, expenseId)
      invalidatePendingApprovals(queryClient)
    },
  })
}
