import { type TDateTime } from '@/domains/shared/types/common'

export interface IProduct {
  id: string
  tenantId: string
  name: string
  description?: string
  unitId: string
  priceNet: number
  vatRateId?: string
  createdAt: TDateTime
  updatedAt: TDateTime
}

export type IProductCreate = Omit<IProduct, 'id' | 'createdAt' | 'updatedAt'>
