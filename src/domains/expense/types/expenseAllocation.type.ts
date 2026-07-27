import type { TDateTime, TUUID } from '@/domains/shared/types/common'

export interface IExpenseAllocationDimension {
  id: TUUID
  allocationId: TUUID
  dimensionType: string
  dimensionTypeLabel: string
  dimensionId: TUUID
  dimensionEntity?: {
    id: TUUID
    name?: string
    code?: string
  } | null
}

export interface IExpenseAllocation {
  id: TUUID
  expenseId: TUUID
  amount: number
  note?: string | null
  status: string
  statusLabel: string
  createdAt?: TDateTime
  dimensions?: IExpenseAllocationDimension[]
}

export interface IExpenseAllocationSummary {
  allocations: IExpenseAllocation[]
  expenseTotal: number
  totalAllocated: number
  remainingToAllocate: number
  isFullyAllocated: boolean
}
