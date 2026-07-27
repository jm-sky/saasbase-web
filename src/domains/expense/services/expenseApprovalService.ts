import { isAxiosError } from 'axios'
import api from '@/lib/api'
import { apiRoutesMap } from '@/lib/api/apiRoutes'
import type {
  IExpenseApprovalExecution,
  IExpenseCanApprove,
  IPendingExpenseApproval,
  TApprovalDecision,
} from '../types/expenseApproval.type'
import type { IResourceCollection } from '@/domains/shared/types/resource.type'
import type { IResource } from '@/domains/shared/types/resource.type'

class ExpenseApprovalService {
  async getExecution(expenseId: string): Promise<IExpenseApprovalExecution | null> {
    try {
      const response = await api.get<IResource<IExpenseApprovalExecution>>(
        `${apiRoutesMap.expenses}/${expenseId}/approval`,
      )
      return response.data.data
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response?.status === 404) {
        return null
      }
      throw error
    }
  }

  async canApprove(expenseId: string): Promise<IExpenseCanApprove> {
    const response = await api.get<{ data: IExpenseCanApprove }>(
      `${apiRoutesMap.expenses}/${expenseId}/approval/can-approve`,
    )
    return response.data.data
  }

  async start(expenseId: string): Promise<IExpenseApprovalExecution | { autoApproved: true }> {
    const response = await api.post<{
      data: IExpenseApprovalExecution | { autoApproved: true, approvalStatus?: string }
    }>(`${apiRoutesMap.expenses}/${expenseId}/approval/start`, {})

    const data = response.data.data
    if ('autoApproved' in data) {
      return { autoApproved: true }
    }

    return data
  }

  async processDecision(
    expenseId: string,
    decision: TApprovalDecision,
    reason?: string,
  ): Promise<void> {
    await api.post(`${apiRoutesMap.expenses}/${expenseId}/approval/decision`, {
      decision,
      reason,
    })
  }

  async listPending(page = 1, perPage = 15): Promise<IResourceCollection<IPendingExpenseApproval>> {
    const response = await api.get<IResourceCollection<IPendingExpenseApproval>>('/pending-approvals', {
      params: { page, perPage },
    })
    return response.data
  }
}

export const expenseApprovalService = new ExpenseApprovalService()
