import type { IExpenseFilters } from '../services/expenseService'

export const expenseKeys = {
  all: ['expenses'] as const,
  lists: () => [...expenseKeys.all, 'list'] as const,
  list: (filters?: IExpenseFilters) => [...expenseKeys.lists(), filters] as const,
  details: () => [...expenseKeys.all, 'detail'] as const,
  detail: (id: string) => [...expenseKeys.details(), id] as const,
  allocations: (expenseId: string) => [...expenseKeys.detail(expenseId), 'allocations'] as const,
  allocationDimensions: () => [...expenseKeys.all, 'allocation-dimensions'] as const,
  approval: (expenseId: string) => [...expenseKeys.detail(expenseId), 'approval'] as const,
  canApprove: (expenseId: string) => [...expenseKeys.detail(expenseId), 'can-approve'] as const,
  pendingApprovals: (page: number, perPage: number) =>
    [...expenseKeys.all, 'pending-approvals', page, perPage] as const,
}
