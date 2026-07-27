import api from '@/lib/api'
import { apiRoutesMap } from '@/lib/api/apiRoutes'
import type {
  IExpenseAllocation,
  IExpenseAllocationSummary,
} from '../types/expenseAllocation.type'
import type { IExpenseAllocationLinePayload } from '../types/expenseDimension.type'

class ExpenseAllocationService {
  async list(expenseId: string): Promise<IExpenseAllocation[]> {
    const response = await api.get<{ data: IExpenseAllocation[] }>(
      `${apiRoutesMap.expenses}/${expenseId}/allocations`,
    )
    return response.data.data
  }

  async autoAllocate(expenseId: string): Promise<IExpenseAllocationSummary> {
    const response = await api.post<{ data: IExpenseAllocationSummary }>(
      `${apiRoutesMap.expenses}/${expenseId}/allocations/auto`,
      {},
    )
    return response.data.data
  }

  async clear(expenseId: string): Promise<void> {
    await api.delete(`${apiRoutesMap.expenses}/${expenseId}/allocations/clear`)
  }

  async store(
    expenseId: string,
    allocations: IExpenseAllocationLinePayload[],
  ): Promise<IExpenseAllocationSummary> {
    const response = await api.post<{ data: IExpenseAllocationSummary }>(
      `${apiRoutesMap.expenses}/${expenseId}/allocations`,
      { allocations },
    )
    return response.data.data
  }
}

export const expenseAllocationService = new ExpenseAllocationService()
