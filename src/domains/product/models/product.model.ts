import { type TDateTime } from '@/domains/shared/types/common'
import type { IMedia } from '@/domains/shared/types/media.type'


export interface IMeasurementUnit {
  id: string
  name: string
  code: string
  createdAt: TDateTime
}

export interface IVatRate {
  id: string
  name: string
  rate: number
  createdAt: TDateTime
}

export interface IProduct {
  id: string
  tenantId: string
  name: string
  description?: string
  unitId?: string
  priceNet?: number
  vatRateId?: string
  logoUrl?: string
  logo?: IMedia
  unit?: IMeasurementUnit
  vatRate?: IVatRate
  tags?: string[]
  createdAt: TDateTime
  updatedAt: TDateTime
}

export type IProductCreate = Omit<IProduct, 'id' | 'tenantId' | 'logo' | 'logoUrl' | 'createdAt' | 'updatedAt'>
