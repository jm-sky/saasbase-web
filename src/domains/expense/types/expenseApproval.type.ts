import type { TDateTime, TUUID } from '@/domains/shared/types/common'

export type TApprovalDecision = 'approved' | 'rejected'

export interface IExpenseApprovalExecution {
  id: TUUID
  expenseId: TUUID
  status: string
  statusLabel: string
  startedAt?: TDateTime | null
  completedAt?: TDateTime | null
  isPending: boolean
  isComplete: boolean
  isApproved: boolean
  isRejected: boolean
  currentStep?: {
    id: TUUID
    name: string
  } | null
}

export interface IPendingExpenseApproval extends IExpenseApprovalExecution {
  waitingTime?: number | null
  currentStepName?: string | null
  expenseAmount?: number | null
  expenseNumber?: string | null
  expenseCreator?: {
    id: TUUID
    name: string
    email?: string
  } | null
}

export interface IExpenseCanApprove {
  canApprove: boolean
  reason?: string | null
  execution?: {
    id: TUUID
    status: string
    currentStepName?: string | null
  }
}
