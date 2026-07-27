import type { TUUID } from '@/domains/shared/types/common'

export interface IAllocationDimensionItem {
  id: TUUID
  code?: string | null
  name?: string | null
  displayName?: string | null
  description?: string | null
  isActive?: boolean
}

export interface IAllocationDimensionData {
  dimensionType: string
  label: string
  labelEN: string
  isAlwaysVisible: boolean
  isConfigurable: boolean
  items: IAllocationDimensionItem[]
}

export interface IExpenseAllocationLinePayload {
  amount: number
  note?: string
  dimensions?: { type: string, id: string }[]
}
